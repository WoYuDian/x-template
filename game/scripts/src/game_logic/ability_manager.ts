import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'
import {getPlayerAbilityState, getPlayerBookState} from '../ability_graph/graph_helper'
import {printObject} from '../util'

const configuration = {
    playerInitialAbilityPoints: 3
}
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
        abilityInfo.ability_points[key] = configuration.playerInitialAbilityPoints;
        abilityInfo.book_map[key] = {basic_ability: 1}
    }

    cacheSet('playerAbilityInfo', abilityInfo)
    cacheUpdate('playerAbilityInfo')
}

export function playerUpgradeAbility(event) {
    const playerIdStr = event.playerId.toString()
    const abilityInfo: playerAbilityInfo = cacheGet('playerAbilityInfo');
    const abilityState = getPlayerAbilityState(abilityInfo.ability_points[playerIdStr], abilityInfo.ability_level_map[playerIdStr], abilityInfo.book_map[playerIdStr], event.abilityName);

    const hero = PlayerResource.GetSelectedHeroEntity(event.playerId);
    if(!hero.HasAbility(event.abilityName)) {
        hero.AddAbility(event.abilityName)        
    }

    const ability = hero.FindAbilityByName(event.abilityName);

    if(!ability) {
        print('Not found the ability')
        return;
    }

    if(abilityState.level < ability.GetMaxLevel()) {
        hero.UpgradeAbility(ability);
        abilityInfo.ability_points[playerIdStr] -= 1;
        if(!abilityInfo.ability_level_map[playerIdStr]) {
            abilityInfo.ability_level_map[playerIdStr] = {}
        }

        if(!abilityInfo.ability_level_map[playerIdStr][event.abilityName]) {
            abilityInfo.ability_level_map[playerIdStr][event.abilityName] = 0;
        }
        abilityInfo.ability_level_map[playerIdStr][event.abilityName] += 1;
        cacheUpdate('playerAbilityInfo')
    }    
}

export function learnBook(bookName: string, playerId: PlayerID) {
    const playerIdStr = playerId.toString()
    const abilityInfo: playerAbilityInfo = cacheGet('playerAbilityInfo');
    const bookState = getPlayerBookState(abilityInfo.book_map[playerIdStr], bookName);

    if(bookState.learned) {
        return false;
    } else {
        if(bookState.learnable) {
            abilityInfo.book_map[playerIdStr][bookName] = 1;
            cacheUpdate('playerAbilityInfo')
            return true;
        } else {
            return false;
        }        
    }    
}

export function addPlayerAbilityPoints(playerId: PlayerID) {
    const abilityInfo: playerAbilityInfo = cacheGet('playerAbilityInfo');

    abilityInfo.ability_points[playerId.toString()] += 1;
    cacheUpdate('playerAbilityInfo')
}