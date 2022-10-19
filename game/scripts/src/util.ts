// @ts-nocheck
export function printObject(object, level = 0, skipKeys = []) {
    let indentation = '';
    for(let i = 0; i < level; i++) {
        indentation += ' @ '
    }
    for(const key in object) {
        if(skipKeys.indexOf(key) > -1) {
            continue;
        }
        print(indentation, key, '++', object[key])
        if(object[key] instanceof Object) {
            printObject(object[key], level + 1, skipKeys)
        }
    }
}

export function MapWearables() {
    GameRules.items = LoadKeyValues("scripts/items/items_game.txt")['items']
    GameRules.modelmap = {}
    for(const k in GameRules.items) {        
        const v = GameRules.items[k]
        if (v.name && (v.prefab != "loading_screen")) {
            GameRules.modelmap[v.name] = k
        }
    }
}

export function GenerateDefaultBlock( heroName ) {
    print("    \"Creature\"")
    print("    {")
    print("        \"AttachWearables\" ", "// Default ", heroName)
    print("        {")
    const defCount = 1
    for (const code in  GameRules.items) {
        const values = GameRules.items[code];
        if (values.name && (values.prefab == "default_item") && values.used_by_heroes) {
            for (const k in values.used_by_heroes) {
                if (k == heroName) {
                    const itemID = GameRules.modelmap[values.name]
                    GenerateItemDefLine( defCount, itemID, values.name )
                    defCount = defCount + 1
                }
            }
        }
    }
    print("        }")
    print("    }")
}
 
export function GenerateBundleBlock( setname ) {
    const bundle = {}
    for (const code in GameRules.items) {
        const values = GameRules.items[code]        
        if (values.name && (values.name == setname) && values.prefab && (values.prefab == "bundle")) {
            bundle = values.bundle
        }
    }

    print("    \"Creature\"")
    print("    {")
    print("        \"AttachWearables\" ", "// ", setname)
    print("        {")
    const wearableCount = 1
    for (const k in bundle) {
        
        const itemID = GameRules.modelmap[k]
        if (itemID) {
            GenerateItemDefLine(wearableCount, itemID, k)
            wearableCount = wearableCount+1
        }
    }
    print("        }")
    print("    }")
}
 
export function GenerateItemDefLine( i, itemID, comment ) {
    print("            \"", tostring(i), "\" { ", "\"ItemDef\" \"", itemID, "\" } // ", comment, '++++++++++++++')
}

export function calcDistanceOfTwoPoint(from: Vector, to: Vector) {
    const distance = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2))
    return distance
}

export function findUnitsInRing(
    team: DotaTeam, 
    cacheUnit: CBaseEntity, 
    position: Vector, 
    outerRadius: number, 
    innerRadius: number, 
    targetTeam: UnitTargetTeam, 
    targetType: UnitTargetType, 
    targetFlag: UnitTargetFlags, 
    findOrder: FindOrder, 
    canGrowCache: boolean): CDOTA_BaseNPC[] {
    const unitsInRing = [];
    const units = FindUnitsInRadius(team, position, cacheUnit, outerRadius, targetTeam, targetType, targetFlag, findOrder, canGrowCache);

    for(const unit of units) {
        if(calcDistanceOfTwoPoint(unit.GetAbsOrigin(), position) >= innerRadius) {
            unitsInRing.push(unit)
        }
    }

    return unitsInRing
}

export function rotateVector(direction: Vector, angle: number) {
    angle = Math.PI * (angle / 180);
    return Vector(
        math.cos(angle) * direction.x - direction.y * Math.sin(angle), 
        direction.x * Math.sin(angle) + direction.y * Math.cos(angle), 
        0)
}

export function getPlayerHeroById(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId)

    if(player) {
        return player.GetAssignedHero()
    } else {
        return null;
    }
}

export function addAbilityToUnit(unit: CDOTA_BaseNPC, abilityName: string) {
    const ability = unit.AddAbility(abilityName)
    ability.SetLevel(ability.GetMaxLevel())
    if(!ability.IsPassive()) {
        for(let i = 31; i >= 0; i--) {
            const slotAbility = unit.GetAbilityByIndex(i)
            if(slotAbility && slotAbility.IsPassive()) {
                unit.SwapAbilities(abilityName, slotAbility.GetAbilityName(), true, true)
            }
        }        
    }

}