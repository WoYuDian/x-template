//@ts-nocheck
import * as unitMap from './configuration/drop/unit_map.json'
import * as itemMap from './configuration/drop/item_map.json'

export function loadUnitDropMap() {
    const dropMap: any = {}
    for(const key in unitMap) {
        dropMap[key] = {level: unitMap[key].level, drops: {}}

        if(unitMap[key].drops)
        for(const drop of unitMap[key].drops) {
            dropMap[key].drops[drop.name] = drop
        }
    }

    for(const key in itemMap) {
        const itemConf = itemMap[key];
        if(key == 'default') continue;
        if(itemConf.is_common) {
            for(const unitKey in dropMap) {
                if(!dropMap[unitKey].drops) {
                    dropMap[unitKey].drops = {}
                }
                dropMap[unitKey].drops[key] = ({name: key, chance: itemConf.common_chance})
                if(itemConf.params) {
                    dropMap[unitKey].drops[key].params = itemConf.params
                }
            }

        } else {
            for(const unitConf of itemConf.units) {
                if(!dropMap[unitConf.unit]) {
                    dropMap[unitConf.unit] = {level: 1, drops: {}}
                }
                if(!dropMap[unitConf.unit].drops) {
                    dropMap[unitConf.unit].drops = {}
                }
                dropMap[unitConf.unit as string].drops[key] = ({name: key, chance: unitConf.chance})
            }
        }
    }

    return dropMap
}