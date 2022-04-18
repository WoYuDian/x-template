import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'

type playerAbilityInfo = CustomTableType<'player_ability_info', 'ability_info'>
export function initPlayerAbilityInfo() {
    print("Init player ability info");

    const abilityInfo: playerAbilityInfo = {
        book_map: {},
        ability_points: {},
        ability_level_map: {}
    }

    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map');

    for(const key in playerMap) {
        abilityInfo.ability_points[key] = 1;
    }

    cacheSet('playerAbilityInfo', abilityInfo)
    cacheUpdate('playerAbilityInfo')
}