import {cacheGet, cacheSet , cacheUpdate, CustomTableType} from '../cache'

const configuration = {
    hero_selection_duration: 5,
    practice_prepare_duration: 5,
    practice_duration: 5,
    practice_round_num_before_rank: 2,
    rank_prepare_duration: 5,
    rank_duration: 5,
    rand_round_num_before: 2,
    cycle_prepare_duration: 5,
    cycle_duration: 5
}
type stateInfo = CustomTableType<'game_state_info', 'state_info'>
export function checkGameTime() {
    let stateInfo: stateInfo = cacheGet('gameStateInfo');
    const gameTime = GameRules.GetGameTime()

    if(!stateInfo) {
        stateInfo = {
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
        }
    }

    if(stateInfo.round_count == 0) {
        
    }
}

function tickGameTime() {

}