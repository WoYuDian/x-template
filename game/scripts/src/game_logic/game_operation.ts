import * as unitCompositions from './configuration/unit_composition.json'
import { cacheGet, cacheSet, cacheUpdate, CustomTableType } from '../cache';
import { printObject } from '../util';
import * as configuration from './configuration/game_state.json'

export function teleportPlayerToHome(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId);

    if(player) {
        const hero = player.GetAssignedHero()
        
        hero.SetRespawnPosition(getPlayerHomePosition(playerId))
        if(hero) {
            hero.RespawnHero(false, false)
            // CenterCameraOnUnit(playerId, hero)
        }
    }
    
}

export function teleportPlayerToJungle(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId);

    if(player) {
        const hero = player.GetAssignedHero()
        hero.SetRespawnPosition(getPlayerJunglePosition(playerId))
        if(hero) {
            hero.RespawnHero(false, false)
            // CenterCameraOnUnit(playerId, hero)
        }
    }    
}

export function teleportPlayerToArena(playerId: PlayerID, side: 'left' | 'right') {
    const player = PlayerResource.GetPlayer(playerId);

    if(player) {
        const hero = player.GetAssignedHero()
        hero.SetRespawnPosition(getArenaPosition(side))
        if(hero) {
            hero.RespawnHero(false, false)
            // CenterCameraOnUnit(playerId, hero)
        }
    }    
}

export function createUnitInHomeForTest(unitName: string, playerId: PlayerID) {
    const homePosition = getPlayerHomePosition(playerId)
    CreateUnitByName(unitName, Vector(homePosition.x + RandomInt(500, 550), homePosition.y + RandomInt(500, 550), homePosition.z) , true, null, PlayerResource.GetPlayer(playerId), DotaTeam.BADGUYS)    
}

export function createUnitInJungle(unitName: string, playerId: PlayerID) {
    CreateUnitByName(unitName, getPlayerUnitJunglePosition(playerId), true, null, PlayerResource.GetPlayer(playerId), DotaTeam.NEUTRALS)    
}

export function createUnitInArena(unitName: string) {
    return CreateUnitByName(unitName, Vector(0, 0, 0), true, null, null, DotaTeam.NEUTRALS)    
}

let unitClearCallback: Function = null;
export function createUnitCompositionInJungle(compositionName: string, playerId: PlayerID, callback: Function) {
    unitClearCallback = callback;
    const battleInfo: CustomTableType<'player_battle_info', 'battle_info'> = cacheGet('battleInfo');

    const unitComposition = unitCompositions[compositionName];

    if(unitComposition && unitComposition.units) {
        battleInfo[playerId.toString()] = {unit_stats: {}, score: 0}
        for(const unit of unitComposition.units) {
            if(!battleInfo[playerId.toString()].unit_stats[unit.name]) {
                battleInfo[playerId.toString()].unit_stats[unit.name] = {num: 0, killed: 0}
            }

            const position = getPlayerUnitJunglePosition(playerId);
            battleInfo[playerId.toString()].unit_stats[unit.name].num += 1;
            CreateUnitByName(unit.name, Vector(position.x + unit.offset.x, position.y + unit.offset.y, position.z), true, null, PlayerResource.GetPlayer(playerId), DotaTeam.NEUTRALS)
        }
    } else {
        print("No unit composition found: ", compositionName)
    }
    
}

export function recordUnitKill(killedUnit: CDOTA_BaseNPC_Creature, playerId: PlayerID) {
    const unitName = killedUnit.GetUnitName();
    const battleInfo: CustomTableType<'player_battle_info', 'battle_info'> = cacheGet('battleInfo');
    if(battleInfo && battleInfo[playerId.toString()] && battleInfo[playerId.toString()]?.unit_stats[unitName]) {
        battleInfo[playerId.toString()].unit_stats[unitName].killed += 1;
        if((battleInfo[playerId.toString()].unit_stats[unitName].killed == battleInfo[playerId.toString()].unit_stats[unitName].num) && unitClearCallback) {
            unitClearCallback(playerId)
        }
    }
}

export function recordHeroKill(killedUnit: CDOTA_BaseNPC_Hero, attackerId: PlayerID) {
    const stateInfo: CustomTableType<'game_state_info', 'state_info'> = cacheGet('gameStateInfo');

    if(stateInfo.state == 'rank_in_progress') {
        const challange = stateInfo.challenge_order[stateInfo.challenge_index];
        if((killedUnit.GetPlayerID().toString() == challange.challenger) && (attackerId.toString() == stateInfo.player_rank_info[challange.rank])) {
            challange.winner = 'target'
        } else if((killedUnit.GetPlayerID().toString() == stateInfo.player_rank_info[challange.rank]) && (attackerId.toString() == challange.challenger)) {
            challange.winner = 'challenger'
        }

        nextChallenge()
        cacheUpdate('gameStateInfo')
    }
}

export function killAllUnits() {
    const units = FindUnitsInRadius(DotaTeam.NEUTRALS, Vector(0, 0, 0), null, 8688, UnitTargetTeam.BOTH, UnitTargetType.ALL, UnitTargetFlags.NONE, FindOrder.ANY, true)

    const battleInfo: CustomTableType<'player_battle_info', 'battle_info'> = cacheGet('battleInfo');
    for(const unit of units) {        
        if(unit.GetTeam() == DotaTeam.NEUTRALS) {
            if(unit.GetOwnerEntity()) {
                const playerId = PlayerResource.GetNthPlayerIDOnTeam(unit.GetOwnerEntity().GetTeam(), 1);

                if(battleInfo && battleInfo[playerId.toString()] && battleInfo[playerId.toString()].score) {
                    battleInfo[playerId.toString()].score += (unit.GetMaxHealth() - unit.GetHealth());
                }
            }

            unit.ForceKill(false)
        }        
    }
}

function getPlayerHomePosition(playerId: PlayerID) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;

    return Vector(playerLocation.x + 1024, playerLocation.y - 1024, playerLocation.z)
}

function getPlayerJunglePosition(playerId: PlayerID) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;

    return Vector(playerLocation.x - 1024, playerLocation.y + 1024, playerLocation.z)
}

function getArenaPosition(side: 'left' | 'right') {
    if(side == 'left') {
        return Vector(-256, 0, 0)
    } else {
        return Vector(256, 0, 0)
    }    
}

function getPlayerUnitJunglePosition(playerId: PlayerID, offset?: Vector) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;
    offset = offset || Vector(0, 0, 0);
    return Vector(playerLocation.x + offset.x - 512, playerLocation.y + 1024 + offset.y, playerLocation.z + offset.z)
}

export function rollDrops(unit: CDOTA_BaseNPC_Creature) {
    //@ts-ignore
    const dropInfo = GameRules.DropTable[unit.GetUnitName()]
    if(dropInfo) {
        print("Rolling Drops for ", unit.GetUnitName())
        for (const key in dropInfo) {
            const itemTable = dropInfo[key];
            let item_name;
            if (itemTable.ItemSets) {
                let count = 0
                for (const key in itemTable.ItemSets) {
                    count = count + 1
                }
                let random_i = RandomInt(1, count)
                item_name = itemTable.ItemSets[tostring(random_i)]
            } else {
                item_name = itemTable.Item
            }

            const chance = itemTable.Chance || 100
            const max_drops = itemTable.Multiple || 1
            for (let i = 0; i < max_drops; i++) {
                print("Rolling chance ", chance)
                if (RollPercentage(chance)) {
                    print("Creating ", item_name)
                    const item = CreateItem(item_name, null, null)
                    item.SetPurchaseTime(0)
                    const pos = unit.GetAbsOrigin()
                    const drop = CreateItemOnPositionSync( pos, item )
                    const randomVector = RandomVector(RandomFloat(150, 200));
                    const pos_launch = Vector(pos.x + randomVector.x, pos.y + randomVector.y, pos.z + randomVector.z)
                    item.LaunchLoot(false, 200, 0.75, pos_launch)
                }
            }
        }
    }
}

export function nextChallenge() {
    const stateInfo: CustomTableType<'game_state_info', 'state_info'> = cacheGet('gameStateInfo');

    let curChallenge;
    if(stateInfo.challenge_index >= 0) {
        curChallenge = stateInfo.challenge_order[stateInfo.challenge_index];   
        teleportPlayerToHome(parseInt(curChallenge.challenger) as PlayerID) 
        teleportPlayerToHome(parseInt(stateInfo.player_rank_info[curChallenge.rank]) as PlayerID) 
    }
    
    if(curChallenge && (curChallenge.winner == 'challenger')) {
        const target = stateInfo.player_rank_info[curChallenge.rank];

        for(const key in stateInfo.player_rank_info) {
            if(stateInfo.player_rank_info[key] == curChallenge.challenger) {
                stateInfo.player_rank_info[key] = target;
            }
        }
        stateInfo.player_rank_info[curChallenge.rank] = curChallenge.challenger
    }
    
    
    stateInfo.challenge_index += 1;
    if(stateInfo.challenge_index < stateInfo.challenge_order.length) {
        const nextChallenge = stateInfo.challenge_order[stateInfo.challenge_index];

        const target = stateInfo.player_rank_info[nextChallenge.rank];
        const challanger = nextChallenge.challenger;
        teleportPlayerToArena(parseInt(target) as PlayerID, 'left')
        teleportPlayerToArena(parseInt(challanger) as PlayerID, 'right')
    
        stateInfo.last_round_time = GameRules.GetGameTime()
    } else {
        stateInfo.last_round_time = GameRules.GetGameTime() - configuration.rank_duration + 5;
    }
    
}

export function getPlayerHeroById(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId)

    if(player) {
        return player.GetAssignedHero()
    } else {
        return null;
    }
}