import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'
import * as heroConf from './configuration/hero_list.json'
import {playerHeroSelection} from '../event_handlers/custom_events'
import * as relicConf from './configuration/relic.json'
import { teleportPlayerToHome, teleportPlayerToJungle, createUnitInArena, createUnitInHomeForTest, createUnitInJungle, killAllUnits, createUnitCompositionInJungle, nextChallenge, initRankAwards, enterRankAwardSelection, finishRankAwardSelection, teleportPlayerToArena } from './game_operation'
import * as configuration from './configuration/game_state.json'
import { stateInfo } from '../common_type'
import { getRoundInfo } from './state_helper';

const rankRoundNum = 2 * (configuration.practice_round_num_before_rank + 1)
export function checkGameTime() {
    
    const gameTime = GameRules.GetGameTime()

    if(!cacheGet('gameStateInfo')) {
        cacheSet('gameStateInfo', {
            last_round_time: gameTime, 
            time_from_last_round: 0,
            state: '',
            round_count_down: 0,
            round_count: 0,
            round_inited: 0,
            round_type: 'hero_selection',
            is_prepare: 1,
            player_relic_selections: {},
            player_hero_pool: {},
            hero_selection_info: {},
            relic_selection_info: {},
            plan_selection_info: {},
            challenge_selection_info: {},
            player_rank_info: {},
            challenge_order: [],
            challenge_index: -1,
            rank_award_info: {round_set: 0, inited: 0, award_map: null},
            player_score: {},
            game_finished: 0
        })
    }

    const stateInfo: stateInfo = cacheGet('gameStateInfo');

    const roundInfo = getRoundInfo(stateInfo.round_count)
    
    stateInfo.state = roundInfo.round_name
    if(roundInfo.round_name == 'hero_selection') {        
        tickGameTime(stateInfo, heroSelectionIniter, heroSelectionSettler, configuration.hero_selection_duration, gameTime)
    } else if(roundInfo.round_name ==  'cycle_prepare') {    
        tickGameTime(stateInfo, cyclePrepareIniter, cyclePrepareSettler, configuration.cycle_prepare_duration, gameTime)                   
    } else if(roundInfo.round_name == 'cycle_in_progress') {
        tickGameTime(stateInfo, cycleIniter, cycleSettler, configuration.cycle_duration, gameTime)
    } else if (roundInfo.round_name == 'rank_prepare') {
        tickGameTime(stateInfo, rankPrepareIniter, rankPrepareSettler, configuration.rank_prepare_duration, gameTime)
    } else if(roundInfo.round_name == 'rank_in_progress') {
        tickGameTime(stateInfo, rankIniter, rankSettler, configuration.rank_duration, gameTime)
    } else if(roundInfo.round_name == 'practice_prepare') {
        tickGameTime(stateInfo, practicePrepareIniter, practicePrepareSettler, configuration.practice_prepare_duration, gameTime)
    } else if(roundInfo.round_name == 'practice_in_progress') {
        tickGameTime(stateInfo, practiceIniter, practiceSettler, configuration.practice_duration, gameTime)
    }

    cacheUpdate('gameStateInfo')
}

function tickGameTime(stateInfo: stateInfo, roundIniter: Function, roundSettler: Function, roundDuration: number, gameTime: number) {
    if(stateInfo.rank_award_info.inited == 0) {
        initRankAwards(stateInfo)    
    }
    
    if(stateInfo.round_inited == 0) {
        if(roundIniter) {
            roundIniter(stateInfo)
            stateInfo.round_inited = 1;
        }        
    }

    stateInfo.time_from_last_round = gameTime - stateInfo.last_round_time;
    stateInfo.round_count_down = roundDuration - stateInfo.time_from_last_round;
    if(stateInfo.round_count_down < 1) {
        let reCount = false;
        if(roundSettler) {
            reCount = roundSettler(stateInfo)
        }

        if(!reCount) {
            stateInfo.last_round_time = gameTime;
            stateInfo.round_inited = 0;
            stateInfo.round_count += 1;
        }     
    }
}

function practicePrepareIniter(stateInfo: stateInfo) {
    stateInfo.relic_selection_info = {};
    stateInfo.plan_selection_info = {};
    
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {        
        teleportPlayerToHome(parseInt(playerId) as PlayerID);
        const playerRealm = getPlayerRealm(parseInt(playerId) as PlayerID)
        let possibilityBonus = 0

        if(playerRealm == 'yuanying') {
            possibilityBonus = 40
        } else if (playerRealm == 'jindan') {
            possibilityBonus = 20
        } else if (playerRealm == 'zhuji') {
            possibilityBonus = 5
        }

        //force advanture
        stateInfo.plan_selection_info[playerId] = {plan_name: 'adventure'}
        const relicIndex = []
        while(relicIndex.length < configuration.relic_selection_size) {            
            const randomIndex = RandomInt(0, relicConf.available_relics.length - 1);

            if((relicIndex.indexOf(randomIndex) < 0) && RollPercentage(relicConf.available_relics[randomIndex].possibility + possibilityBonus)) {
                relicIndex.push(randomIndex)
            }
        }

        const relicPool = {}

        for(let i = 0; i < relicIndex.length; i++) {
            relicPool[i + 1] = {relic: relicConf.available_relics[relicIndex[i] + 1], index: relicIndex[i]}
        }
        // for (const key in relicIndex) {
        //     relicPool[key] = {relic: relicConf.available_relics[relicIndex[key] + 1], index: relicIndex[key]}
        // }        

        stateInfo.player_relic_selections[playerId] = {relic_selections: relicPool}
    }
}

function practicePrepareSettler(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        if(!stateInfo.plan_selection_info[playerId]) {
            stateInfo.plan_selection_info[playerId] = {plan_name: 'practice'}
        } else if((stateInfo.plan_selection_info[playerId].plan_name == 'adventure') && !stateInfo.relic_selection_info[playerId]) {
            const randomIndex = RandomInt(1, configuration.relic_selection_size);

            const relicInfo = stateInfo.player_relic_selections[playerId].relic_selections[randomIndex]
            stateInfo.relic_selection_info[playerId] = {relic_name: relicInfo.relic.relic_name, index: relicInfo.index}
        }
    }
}

function practiceIniter(stateInfo: stateInfo) {    

    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    cacheSet('battleInfo', {})
    for(const playerId in playerMap) {
        teleportPlayerToJungle(parseInt(playerId) as PlayerID);
        const playerRelicSelection = stateInfo.relic_selection_info[playerId]
        const unitComposition = relicConf.available_relics[playerRelicSelection.index].unit_composition
        createUnitCompositionInJungle(unitComposition, parseInt(playerId) as PlayerID, function(playerId: PlayerID) {

        }, stateInfo)     
    }

    cacheUpdate('battleInfo');
}

function practiceSettler(stateInfo: stateInfo) {
    killAllUnits()
}

function rankPrepareIniter(stateInfo: stateInfo) {
    stateInfo.challenge_selection_info = {};  
    stateInfo.challenge_order = [];
    stateInfo.challenge_index = -1;
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        teleportPlayerToHome(parseInt(playerId) as PlayerID);
        // teleportPlayerToArena(parseInt(playerId) as PlayerID, 'left');
    }
}

function rankPrepareSettler(stateInfo: stateInfo) {
    if(stateInfo.player_rank_info['1']) {
        const playerRankMap = {}

        for(const key in stateInfo.player_rank_info) {
            playerRankMap[stateInfo.player_rank_info[key]] = key;
        }

        for(const key in stateInfo.player_rank_info) {
            if(parseInt(key) > 3) {
                stateInfo.challenge_selection_info[stateInfo.player_rank_info[key]] = stateInfo.player_rank_info[tostring(parseInt(key) - RandomInt(1, 3))]
            }
        }

        const challenges = []
        for(const challenger in stateInfo.challenge_selection_info) {            
            challenges.push({challenger: challenger, rank: playerRankMap[stateInfo.challenge_selection_info[challenger]], winner: null})
        }

        challenges.sort(function(a, b) {
            if (parseInt(a.rank) != parseInt(b.rank)) {
                return parseInt(a.rank) - parseInt(b.rank);
            } else {
                return parseInt(playerRankMap[b.challenger]) - parseInt(playerRankMap[a.challenger])
            }
        })

        stateInfo.challenge_order = challenges;        
    }
}

function rankIniter(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    cacheSet('battleInfo', {})
    if(!stateInfo.player_rank_info['1']) {
        for(const key in playerMap) {
            createUnitCompositionInJungle('first_rank', parseInt(key) as PlayerID, function(playerId: PlayerID) {
                for(let i = 1; i <= 8; i++) {
                    if(!stateInfo.player_rank_info[i.toString()]) {
                        stateInfo.player_rank_info[i.toString()] = playerId.toString()
                        break;
                    }
                }
            }, stateInfo)
            teleportPlayerToJungle(parseInt(key) as PlayerID)
        }
        
        cacheUpdate('battleInfo');
    } else {
        nextChallenge()
    }
}

function rankSettler(stateInfo: stateInfo) {
    if(stateInfo.round_count <= rankRoundNum) {
        killAllUnits();
        let rankFinished = true;
        let unRankedIndex;
        const playerRankMap = {}
        for(let i = 1; i <= 8; i++) {
            if(!stateInfo.player_rank_info[i.toString()]) {
                rankFinished = false;
                unRankedIndex = i;
                break;
            } else {
                playerRankMap[stateInfo.player_rank_info[i.toString()]] = i;
            }
        }
    
        if(!rankFinished) {
            const unRankedPlayers = []
            const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')
            const battleInfo: CustomTableType<'player_battle_info', 'battle_info'> = cacheGet('battleInfo');
            for(const key in playerMap) {
                if(!playerRankMap[key]) {
                    unRankedPlayers.push({playerId: key, score: battleInfo[key].score});
                }
            }
    
            unRankedPlayers.sort(function(a,b) {
                return b.score - a.score
            })
    
            for(let i = 0; i < unRankedPlayers.length; i++) {
                stateInfo.player_rank_info[tostring(i + unRankedIndex)] = unRankedPlayers[i].playerId;
            }
        }
    } else {
        if(stateInfo.challenge_index < stateInfo.challenge_order.length) {
            nextChallenge()
            return true;
        }
    }

    if(stateInfo.rank_award_info.round_set == 0) {
        enterRankAwardSelection(stateInfo)
        return true;
    } else {
        finishRankAwardSelection(stateInfo)
    }
}

function cyclePrepareIniter(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        teleportPlayerToHome(parseInt(playerId) as PlayerID);    
    }
}

function cyclePrepareSettler(stateInfo: stateInfo) {
    
}

import { modifier_cycle_boss_zeus_ai } from '../modifiers/modifier_cycle_boss_zeus_ai'
import { getPlayerRealm } from './realm_manager';

function cycleIniter(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        teleportPlayerToHome(parseInt(playerId) as PlayerID);    
    }
    const cycleBoss = createUnitInArena("npc_cycle_boss_zeus")
    cycleBoss.AddNewModifier(null, null, modifier_cycle_boss_zeus_ai.name, {})
}

function cycleSettler(stateInfo: stateInfo) {
    killAllUnits()
}

function heroSelectionIniter(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')
    
    const playerIds = []
    for(const playerId in playerMap) {
        playerIds.push(playerId)
        const heroPool = []
        const heroPoolMap = {}
        while(heroPool.length < configuration.hero_selection_pool_size) {
            const randomIndex = RandomInt(0, heroConf.available_heros.length - 1);

            if(heroPool.indexOf(heroConf.available_heros[randomIndex].name) < 0) {
                heroPool.push(heroConf.available_heros[randomIndex].name)
                heroPoolMap[heroPool.length.toString()] = heroConf.available_heros[randomIndex].name
            }
            
        }
        
        stateInfo.player_hero_pool[playerId] = heroPoolMap
    }

    const playerLocation = {}
    const gridSize = {width: 4096, height: 4096}
    for (let i = 0; i < 8; i++) {

        let index = i;
        if(i >= 4) {
            index = i + 1
        }
        const colNum = index % 3;
        const rowNum = parseInt((index / 3).toString())

        const centerX = (colNum - 1) * gridSize.width;
        const centerY = (rowNum - 1) * gridSize.height;

        if(playerIds[i]) {
            playerLocation[playerIds[i]] = {center: {x: centerX, y: centerY, z: 128}}
        }
        DOTA_SpawnMapAtPosition('basic_home', Vector(centerX, centerY, 128), false, null, null, null)        
    }

    
    DOTA_SpawnMapAtPosition('basic_arena', Vector(0, 0, 128), false, null, null, null)

    CustomNetTables.SetTableValue('player_configuration', 'player_location', playerLocation)

    //for test
    // createUnitInHomeForTest('npc_test_unit', 0 as PlayerID)
    // createUnitInHomeForTest('npc_test_unit', 0 as PlayerID)
}

function heroSelectionSettler(stateInfo: stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const key in playerMap) {
        if(!stateInfo.hero_selection_info[key]) {
            const randomIndex = RandomInt(1, configuration.hero_selection_pool_size);
            const randomHeroName = stateInfo.player_hero_pool[key][randomIndex.toString()]
            stateInfo.hero_selection_info[key] = {hero_name: randomHeroName};
            playerHeroSelection({playerId: parseInt(key) as PlayerID, heroName: randomHeroName})
        }
    }
}