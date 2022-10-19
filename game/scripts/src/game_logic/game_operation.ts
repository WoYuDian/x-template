import * as unitCompositions from './configuration/unit_composition.json'
import { cacheGet, cacheSet, cacheUpdate, CustomTableType } from '../cache';
import { getPlayerHeroById, printObject } from '../util';
import * as configuration from './configuration/game_state.json'
import { stateInfo } from '../common_type';
import { modifierMap } from '../common_modifier_map';
import { addForceOfRule } from './realm_manager';
import * as rankAwardConfiguration from './configuration/rank_awards.json'
import { Timers } from '../lib/timers';
import { loadUnitDropMap } from './drop_helper';
import { loadHeroMap } from './hero_helper';
import { addAbilityToUnit } from '../util';
const dropInfo = loadUnitDropMap()
const heroMap = loadHeroMap()
export function teleportPlayerToHome(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId);

    if(player) {
        const hero = player.GetAssignedHero()
        
        hero.SetRespawnPosition(getPlayerHomePosition(playerId))
        if(hero) {
            respawnHero(hero)
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
            respawnHero(hero)
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
            respawnHero(hero)
            // CenterCameraOnUnit(playerId, hero)
        }
    }    
}

export function respawnHero(hero: CDOTA_BaseNPC_Hero) {
    const stateInfo: stateInfo = cacheGet('gameStateInfo');
    const playerScore = stateInfo.player_score[hero.GetPlayerOwnerID().toString()]
    if(playerScore && (playerScore.dead == 1)) {
        return;
    }

    hero.RespawnHero(false, false)
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
export function createUnitCompositionInJungle(compositionName: string, playerId: PlayerID, callback: Function, stateInfo: stateInfo) {
    const hero = getPlayerHeroById(playerId)
    hero.AddNewModifier(null, null, modifierMap['modifier_practice_creep'], {round_count: stateInfo.round_count})
    unitClearCallback = callback;
    const battleInfo: CustomTableType<'player_battle_info', 'battle_info'> = cacheGet('battleInfo');

    const unitComposition = unitCompositions[compositionName];

    if(unitComposition && unitComposition.units) {
        battleInfo[playerId.toString()] = {unit_stats: {}, score: 0}
        for(const unit of unitComposition.units) {
            if(!battleInfo[playerId.toString()].unit_stats[unit.name]) {
                battleInfo[playerId.toString()].unit_stats[unit.name] = {num: 0, killed: 0}
            }

            let createNum = 1
            let radius = 0

            if(unit.multiple && unit.multiple.num) {
                createNum = unit.multiple.num
                radius = unit.multiple.radius || 0
            }

            const position = getPlayerUnitJunglePosition(playerId);

            for(let i = 0; i < createNum; i++) {
                const unitPosition = Vector(position.x + unit.offset.x + RandomFloat(-radius, radius),
                    position.y + unit.offset.y + RandomFloat(-radius, radius),
                    position.z
                )

                battleInfo[playerId.toString()].unit_stats[unit.name].num += 1;

                const createdUnit = CreateUnitByName(unit.name, unitPosition, true, null, PlayerResource.GetPlayer(playerId), DotaTeam.NEUTRALS)
            
                if(unitComposition.modifiers) {
                    for(const modifierName of unitComposition.modifiers) {
                        const params: any = {}

                        if(stateInfo) {
                            params.round_count = stateInfo.round_count
                        }

                        createdUnit.AddNewModifier(createdUnit, null, modifierMap[modifierName], params)
                    }
                }

                if(unit.ability_map) {
                    const curLevel = Math.floor(stateInfo.round_count / 16) + 1;

                    for(let i = 1; i <= curLevel; i++) {
                        const levelAbilities = unit.ability_map[i.toString()]
                        if(levelAbilities) {
                            for(const key in levelAbilities) {
                                addAbilityToUnit(createdUnit, levelAbilities[key])
                            }
                        }
                    }
                }

                if(unit.modifiers) {
                    for(const modifierName of unit.modifiers) {
                        const params: any = {}

                        if(stateInfo) {
                            params.round_count = stateInfo.round_count
                        }

                        createdUnit.AddNewModifier(createdUnit, null, modifierMap[modifierName], params)
                    }
                }
                
                if(unit.force_of_rules) {
                    let length = 0
                    for(const key in unit.force_of_rules) {
                        length += 1
                    }

                    const extra = Math.floor(stateInfo.round_count / (5 * length))
                    for(const forceOfRule in unit.force_of_rules) {
                        addForceOfRule({rule_name: forceOfRule, bonus: unit.force_of_rules[forceOfRule] + extra}, createdUnit)
                    }
                }
            }

            
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

        let cleared = true;
        for(const key in battleInfo[playerId.toString()]?.unit_stats) {
            const unitStat = battleInfo[playerId.toString()]?.unit_stats[key]
            if(unitStat.killed < unitStat.num) {
                cleared = false
            }
        }

        if(cleared && unitClearCallback) {
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

        setRoundCountDown(3)
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
    // const dropInfo = GameRules.DropTable[unit.GetUnitName()]
    if(dropInfo) {
        const unitName = unit.GetUnitName()
        const unitConf = dropInfo[unitName]
        print("Rolling Drops for ", unit.GetUnitName())
        if(unitConf) {
            const dropArr = []
            for(const key in unitConf.drops) {
                dropArr.push(key)
            }

            const pickedArr = []

            while((pickedArr.length < 3) && (pickedArr.length < dropArr.length)) {
                const randomIndex = RandomInt(0, dropArr.length)

                if(pickedArr.indexOf(dropArr[randomIndex]) < 0) {
                    pickedArr.push(dropArr[randomIndex])
                }
            }

            pickedArr.push('item_lingshi')

            for(const index of pickedArr) {
                const drop = unitConf.drops[index]
                if(RollPercentage(drop.chance)) {
                    const item = CreateItem(drop.name, null, null)
                    // print('create the item:', drop.name,'===========')
                    if(drop.name == 'item_lingshi') {
                        //@ts-ignore
                        item.params = {max: drop.params.max || 100, min: drop.params.min || 50}
                    } else if(drop.params) {
                        //@ts-ignore
                        item.params = drop.params                    
                    }

                    item.SetPurchaseTime(0)
                    const pos = unit.GetAbsOrigin()
                    const dropOp = CreateItemOnPositionSync( pos, item )
                    const randomVector = RandomVector(RandomFloat(150, 200));
                    const pos_launch = Vector(pos.x + randomVector.x, pos.y + randomVector.y, pos.z + randomVector.z)
                    item.LaunchLoot(false, 200, 0.75, pos_launch)
                }
            }
        }
        // for (const key in dropInfo) {
        //     const itemTable = dropInfo[key];
        //     let item_name;
        //     if (itemTable.ItemSets) {
        //         let count = 0
        //         for (const key in itemTable.ItemSets) {
        //             count = count + 1
        //         }
        //         let random_i = RandomInt(1, count)
        //         item_name = itemTable.ItemSets[tostring(random_i)]
        //     } else {
        //         item_name = itemTable.Item
        //     }

        //     const chance = itemTable.Chance || 100
        //     const max_drops = itemTable.Multiple || 1
        //     for (let i = 0; i < max_drops; i++) {
        //         print("Rolling chance ", chance)
        //         if (RollPercentage(chance)) {
        //             print("Creating ", item_name)
        //             const item = CreateItem(item_name, null, null)
        //             if(itemTable.params) {
        //                 //@ts-ignore
        //                 item.params = itemTable.params
        //             }
        //             //@ts-ignore
        //             if(unit.bonusParams) {
        //                 //@ts-ignore
        //                 item.params.bonusParams = unit.bonusParams
        //             }

        //             item.SetPurchaseTime(0)
        //             const pos = unit.GetAbsOrigin()
        //             const drop = CreateItemOnPositionSync( pos, item )
        //             const randomVector = RandomVector(RandomFloat(150, 200));
        //             const pos_launch = Vector(pos.x + randomVector.x, pos.y + randomVector.y, pos.z + randomVector.z)
        //             item.LaunchLoot(false, 200, 0.75, pos_launch)
        //         }
        //     }
        // }
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

export function setRoundCountDown(seconds: number) {
    const stateInfo: CustomTableType<'game_state_info', 'state_info'> = cacheGet('gameStateInfo');

    stateInfo.last_round_time = GameRules.GetGameTime() - configuration.rank_duration + seconds;    
}

export function enterRankAwardSelection(stateInfo: stateInfo) {
    stateInfo.rank_award_info.round_set = 1;
    stateInfo.last_round_time = GameRules.GetGameTime()
}

export function finishRankAwardSelection(stateInfo: stateInfo) {
    const rankInfo = stateInfo.player_rank_info;
    const rankAwardInfo = stateInfo.rank_award_info.award_map;

    for(let i = 1; i <= 8; i++) {
        if(rankInfo[i.toString()]) {
            let selectedAward = false
            for(let j = 1; j <= 8; j++) {                
                if(rankAwardInfo[j] && (rankAwardInfo[j].player_id == rankInfo[i.toString()])) {
                    selectedAward = true;
                    break;
                }
            }

            if(!selectedAward) {
                for(let j = 1; i <= 8; j++) {
                    const awardInfo = rankAwardInfo[j]
                    if(!awardInfo.player_id) {
                        awardInfo.player_id = rankInfo[i.toString()]
                        break;
                    }
                }
            }
        }        
    }

    for(let i = 1; i <= 8; i++) {
        const awardInfo = rankAwardInfo[i]
        if(awardInfo && awardInfo.player_id) {
            const hero = getPlayerHeroById(parseInt(awardInfo.player_id) as PlayerID);

            if(hero) {
                hero.AddItemByName(awardInfo.name)
            }
        }
    }

    stateInfo.rank_award_info = {round_set: 0, inited: 0, award_map: null}
}

export function initRankAwards(stateInfo: CustomTableType<'game_state_info', 'state_info'>) {
    stateInfo.rank_award_info.award_map = {};

    const indexArr = []

    while(indexArr.length < 8) {
        const randomIndex = RandomInt(0, rankAwardConfiguration.award_list.length - 1);

        if((indexArr.indexOf(randomIndex) < 0) && RollPercentage(rankAwardConfiguration.award_list[randomIndex].possibility + (stateInfo.round_count / 1))) {
            indexArr.push(randomIndex)
        }        
    }

    for(let i = 0; i < indexArr.length; i++) {
        stateInfo.rank_award_info.award_map[i + 1] = {name: rankAwardConfiguration.award_list[indexArr[i] + 1].name, player_id: null}
    }

    stateInfo.rank_award_info.inited = 1
}

export function clearUnitAbility(unit: CDOTA_BaseNPC) {
    for(let i = 0; i < 32; i++) {
        const ability = unit.GetAbilityByIndex(i) 
        if(ability) {
            unit.RemoveAbility(ability.GetName())
        }
    }
}

export function setHeroInnateAbility(hero: CDOTA_BaseNPC_Hero) {
    const heroConf = heroMap[hero.GetUnitName()]

    for(const key in heroConf.abilities) {
        const abilityName = heroConf.abilities[key]

        addAbilityToUnit(hero, abilityName)
    }
}

export function getUnitFirstItem(unit: CDOTA_BaseNPC) {
    if(!unit.HasInventory()) return;

    const item = unit.GetItemInSlot(0)

    if(!item) return null;

    const toughness = item.GetSpecialValueFor('toughness')
    const hardness = item.GetSpecialValueFor('hardness')
    const weight = item.GetSpecialValueFor('weight')
    const forceOfFire = item.GetSpecialValueFor('fire')
    const forceOfWater = item.GetSpecialValueFor('water')
    const forceOfRock = item.GetSpecialValueFor('rock')
    const forceOfWood = item.GetSpecialValueFor('wood')
    const forceOfMetal = item.GetSpecialValueFor('metal')
    const forceOfBody = item.GetSpecialValueFor('body')
    const forceOfSpirit = item.GetSpecialValueFor('spirit')
    const materialAbility1 = item.GetSpecialValueFor('material_ability_1') || 0
    const materialAbility2 = item.GetSpecialValueFor('material_ability_2') || 0

    return {item, toughness, hardness, weight, forceOfFire, forceOfWater, forceOfRock, forceOfWood, forceOfMetal, forceOfBody, forceOfSpirit, materialAbility1, materialAbility2}
}

export function openFowForTeam(team: DotaTeam) {
    AddFOWViewer(team, Vector(3072, 4096, 0), 4096, 10000000, false)    
    AddFOWViewer(team, Vector(-3072, 4096, 0), 4096, 10000000, false)
    AddFOWViewer(team, Vector(3072, -4096, 0), 4096, 10000000, false)
    AddFOWViewer(team, Vector(-3072, -4096, 0), 4096, 10000000, false)
    AddFOWViewer(team, Vector(-3072, 0, 0), 4096, 10000000, false)
    AddFOWViewer(team, Vector(3072, 0, 0), 4096, 10000000, false)
    AddFOWViewer(team, Vector(0, 0, 0), 4096, 10000000, false)
}

export function checkGameFinish() {
    const stateInfo: stateInfo = cacheGet('gameStateInfo')

    const playerScore = stateInfo.player_score;
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    let aliveCount = 0
    const survivers = []
    for(const key in playerMap) {
        if(!playerScore[key] || (playerScore[key].dead == 0)) {
            aliveCount += 1;
            survivers.push(key)
        }
    }

    if(aliveCount < 1) {
        let curTime = 0, winnerId;
        for(const key in playerScore) {
            if(curTime < playerScore[key].time) {
                winnerId = key,
                curTime = playerScore[key].time
            }
        }

        if(survivers[0]) {
            if(!stateInfo.player_score[survivers[0]]) {
                stateInfo.player_score[survivers[0]] = {dead: 0, time: 0}
            }
            
            stateInfo.player_score[survivers[0]].dead = 0
            stateInfo.player_score[survivers[0]].time = GameRules.GetGameTime()
        }
        
        
        Timers.CreateTimer(3, (function() {
            stateInfo.game_finished = 1
            cacheUpdate('gameStateInfo')
        }).bind(this))
        
        // GameRules.SetGameWinner(getPlayerHeroById(parseInt(winnerId) as PlayerID).GetTeamNumber())
    }
}