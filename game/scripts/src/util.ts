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
