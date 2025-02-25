import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'
import {getPlayerAbilityState, getPlayerBookState} from '../ability_graph/graph_helper'
import {addAbilityToUnit, printObject} from '../util'
import { forceOfRuleMap, addForceOfRule } from './realm_manager'
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

    if(!abilityState.learnable) {
        print("Ability not learnable")
        return;
    }
    const hero = PlayerResource.GetSelectedHeroEntity(event.playerId);

    let ability = hero.FindAbilityByName(event.abilityName);
    if(!hero.HasAbility(event.abilityName)) {
        addAbilityToUnit(hero, event.abilityName)   
        ability = hero.FindAbilityByName(event.abilityName);
    }

    if(!ability) {
        print('Not found the ability')
        return;
    }

    if(abilityState.level < ability.GetMaxLevel()) {
        ability.SetLevel(abilityState.level + 1)
        abilityInfo.ability_points[playerIdStr] -= 1;
        if(!abilityInfo.ability_level_map[playerIdStr]) {
            abilityInfo.ability_level_map[playerIdStr] = {}
        }

        if(!abilityInfo.ability_level_map[playerIdStr][event.abilityName]) {
            abilityInfo.ability_level_map[playerIdStr][event.abilityName] = {level: 0, learned: 0, max_level: -1};
        }

        if(abilityInfo.ability_level_map[playerIdStr][event.abilityName].max_level == -1) {
            abilityInfo.ability_level_map[playerIdStr][event.abilityName].max_level = ability.GetMaxLevel();
        }
        abilityInfo.ability_level_map[playerIdStr][event.abilityName].level += 1;
        cacheUpdate('playerAbilityInfo')

        if(abilityState.ability.force_of_rule_bonus) {
            for(const key in abilityState.ability.force_of_rule_bonus) {
                const bonusInfo = abilityState.ability.force_of_rule_bonus[key];
                addForceOfRule(bonusInfo, hero)
            }
        }
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

export function learnAbility(abilityName: string, bookName: string, playerId: PlayerID) {
    const playerIdStr = playerId.toString()
    const abilityInfo: playerAbilityInfo = cacheGet('playerAbilityInfo');
    const bookState = getPlayerBookState(abilityInfo.book_map[playerIdStr], bookName);
    const abilityState = getPlayerAbilityState(abilityInfo.ability_points[playerIdStr], abilityInfo.ability_level_map[playerIdStr], abilityInfo.book_map[playerIdStr], abilityName);
    
    if(bookState.learned) {
        return false;
    } else {
        if(abilityState.learned == 1) {
            return false            
        } else {
            if(!abilityInfo.ability_level_map[playerIdStr]) {
                abilityInfo.ability_level_map[playerIdStr] = {}
            }
            if(!abilityInfo.ability_level_map[playerIdStr][abilityName]) {
                abilityInfo.ability_level_map[playerIdStr][abilityName] = {learned: 0, level: 0, max_level: -1}
            }
            abilityInfo.ability_level_map[playerIdStr][abilityName].learned = 1
            cacheUpdate('playerAbilityInfo')
            return true;
        }        
    }    
}

export function addPlayerAbilityPoints(playerId: PlayerID) {
    const abilityInfo: playerAbilityInfo = cacheGet('playerAbilityInfo');

    abilityInfo.ability_points[playerId.toString()] += 1;
    cacheUpdate('playerAbilityInfo')
}