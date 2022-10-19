//@ts-nocheck
import * as heroList from './configuration/hero_list.json'

export function loadHeroMap() {
    const heroMap = {}
    for(const heroConf of heroList.available_heros) {
        heroMap[heroConf.name] = heroConf
    }

    return heroMap
}