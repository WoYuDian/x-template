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

export function teleportPlayerToArena(playerId: PlayerID, side: string) {
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

export function createUnitInJungle(unitName: string, playerId: PlayerID) {
    CreateUnitByName(unitName, getPlayerUnitJunglePosition(playerId), true, null, PlayerResource.GetPlayer(playerId), DotaTeam.NEUTRALS)    
}

export function createUnitCompositionInJungle(compositionName: string, playerId: PlayerID) {

}

export function killAllUnits() {
    const units = FindUnitsInRadius(DotaTeam.NEUTRALS, Vector(0, 0, 0), null, 8688, UnitTargetTeam.BOTH, UnitTargetType.ALL, UnitTargetFlags.NONE, FindOrder.ANY, true)

    for(const unit of units) {        
        if(unit.GetTeam() == DotaTeam.NEUTRALS) {
            unit.ForceKill(false)
        }        
    }


}

function getPlayerHomePosition(playerId: PlayerID) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;

    return Vector(playerLocation.x - 1024, playerLocation.y + 1024, playerLocation.z)
}

function getPlayerJunglePosition(playerId: PlayerID) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;

    return Vector(playerLocation.x - 1024, playerLocation.y - 1024, playerLocation.z)
}

function getArenaPosition(side: string) {
    if(side == 'left') {
        return Vector(-512, 0, 0)
    } else {
        return Vector(512, 0, 0)
    }    
}

function getPlayerUnitJunglePosition(playerId: PlayerID, offset?: Vector) {
    const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[playerId.toString()].center;
    offset = offset || Vector(0, 0, 0);
    return Vector(playerLocation.x + offset.x, playerLocation.y - 1024 + offset.y, playerLocation.z + offset.z)
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