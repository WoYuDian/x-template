import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'
import * as heroConf from './configuration/hero.json'
import {playerHeroSelection} from '../event_handlers/custom_events'
import * as relicConf from './configuration/relic.json'
import { teleportPlayerToHome } from './game_operation'

const configuration = {
    hero_selection_duration: 5,
    hero_selection_pool_size: 3,
    practice_prepare_duration: 5,
    practice_duration: 5,
    practice_round_num_before_rank: 3,
    rank_prepare_duration: 5,
    rank_duration: 5,
    rank_round_num_before_cycle: 1,
    cycle_prepare_duration: 5,
    cycle_duration: 5,
    relic_selection_size: 3
}

const cycleRoundNum = 2 * (configuration.practice_round_num_before_rank * configuration.rank_round_num_before_cycle + configuration.rank_round_num_before_cycle + 1);
const rankRoundNum = 2 * (configuration.practice_round_num_before_rank + 1)
type stateInfo = CustomTableType<'game_state_info', 'state_info'>
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
            plan_selection_info: {}
        })
    }

    const stateInfo: stateInfo = cacheGet('gameStateInfo');

    if(stateInfo.round_count == 0) {
        stateInfo.state = 'hero_selection'
        tickGameTime(stateInfo, heroSelectionIniter, heroSelectionSettler, configuration.hero_selection_duration, gameTime)
    } else {
        const cycleNum = parseInt((stateInfo.round_count / cycleRoundNum).toString());
        const roundNumInCycle = stateInfo.round_count % cycleRoundNum;        
        const rankNumInCycle = parseInt((roundNumInCycle / rankRoundNum).toString());
        const roundInRank = roundNumInCycle % rankRoundNum;
        const practiceNumInRank = parseInt((roundInRank / 2).toString());
        const isPrepare = (stateInfo.round_count % 2) == 1
        stateInfo.is_prepare = isPrepare?1: 0        
        if(((roundNumInCycle == 0) || (roundNumInCycle > (rankRoundNum * configuration.rank_round_num_before_cycle)))) {
            
            if(isPrepare) {
                stateInfo.state = 'cycle_prepare'
                tickGameTime(stateInfo, null, null, configuration.cycle_prepare_duration, gameTime)
            } else {
                stateInfo.state = 'cycle_in_progress'
                tickGameTime(stateInfo, null, null, configuration.cycle_duration, gameTime)
            }            
        } else if ((roundInRank == 0) || (roundInRank > (configuration.practice_round_num_before_rank * 2))) {
            if(isPrepare) {
                stateInfo.state = 'rank_prepare'
                tickGameTime(stateInfo, null, null, configuration.rank_prepare_duration, gameTime)
            } else {
                stateInfo.state = 'rank_in_progress'
                tickGameTime(stateInfo, null, null, configuration.rank_duration, gameTime)
            }
        } else {
            if(isPrepare) {
                stateInfo.state = 'practice_prepare'
                tickGameTime(stateInfo, practicePrepareIniter, practicePrepareSettler, configuration.practice_prepare_duration, gameTime)
            } else {
                stateInfo.state = 'practice_in_progress'
                tickGameTime(stateInfo, null, null, configuration.practice_duration, gameTime)
            }
        }
    }

    cacheUpdate('gameStateInfo')
}

function tickGameTime(stateInfo: stateInfo, roundIniter: Function, roundSettler: Function, roundDuration: number, gameTime: number) {
    if(stateInfo.round_inited == 0) {
        if(roundIniter) {
            roundIniter(stateInfo)
            stateInfo.round_inited = 1;
        }        
    }

    stateInfo.time_from_last_round = gameTime - stateInfo.last_round_time;
    stateInfo.round_count_down = roundDuration - stateInfo.time_from_last_round;

    if(stateInfo.round_count_down < 1) {
        if(roundSettler) {
            roundSettler(stateInfo)
        }

        stateInfo.last_round_time = gameTime;
        stateInfo.round_inited = 0;
        stateInfo.round_count += 1;
    }
}

function practicePrepareIniter(stateInfo: stateInfo) {    
    stateInfo.relic_selection_info = {};
    stateInfo.plan_selection_info = {};
    
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        teleportPlayerToHome(parseInt(playerId) as PlayerID);

        const relicIndex = []
        while(relicIndex.length < configuration.relic_selection_size) {
            const randomIndex = RandomInt(1, relicConf.available_relics.length);

            if(relicIndex.indexOf(randomIndex) < 0) {
                relicIndex.push(randomIndex)
            }
        }

        const relicPool = {}
        for (let i = 0; i < relicIndex.length; i++) {
            relicPool[i] = relicConf.available_relics[relicIndex[i]]
        }        

        stateInfo.player_relic_selections[playerId] = {relic_selections: relicPool}
    }
}

function practicePrepareSettler(stateInfo:  stateInfo) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')

    for(const playerId in playerMap) {
        if(!stateInfo.plan_selection_info[playerId]) {
            stateInfo.plan_selection_info[playerId] = {plan_name: 'practice'}
        } else if((stateInfo.plan_selection_info[playerId].plan_name == 'adventure') && !stateInfo.relic_selection_info[playerId]) {
            const randomIndex = RandomInt(0, configuration.relic_selection_size - 1);
            const relic = stateInfo.player_relic_selections[playerId].relic_selections[randomIndex]
            
            stateInfo.relic_selection_info[playerId] = {relic_name: relic.relic_name}
        }
    }
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

            if(heroPool.indexOf(heroConf.available_heros[randomIndex]) < 0) {
                heroPool.push(heroConf.available_heros[randomIndex])
                heroPoolMap[heroPool.length.toString()] = heroConf.available_heros[randomIndex]
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

    CustomNetTables.SetTableValue('player_configuration', 'player_location', playerLocation)
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