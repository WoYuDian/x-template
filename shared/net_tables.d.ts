declare interface CustomNetTableDeclarations {
    hero_pool: {
        pool: string[];
    };
    player_info: {
        player_map: {[playerId: string]: {steamid: string, accountid: string, level: number | undefined}},
    };
    player_configuration: {
        player_location: {[player_id: string]: {center: {x: number, y: number, z: number}}}
    }
    game_state_info: {
        state_info: {
            last_round_time: number,
            time_from_last_round: number, 
            state: 'practice_in_progress' | 'practice_prepare' | 'rank_in_progress' | 'rank_prepare' | 'cycle_in_progress' | 'cycle_prepare' | 'hero_selection', 
            round_count_down: number, 
            round_count: number, 
            round_inited: 0 | 1, 
            is_prepare: 0 | 1,
            player_relic_selections: {[playerId: string]: {relic_selections: {[key: string]: {relic: {texture_src: string, relic_name: string}, index: number}}}}    
            player_hero_pool: {[key: string]: {[key: string]: string}}        
            hero_selection_info: {[player_id: string]: {hero_name: string}}
            relic_selection_info: {[player_id: string]: {relic_name: string, index: number}},
            plan_selection_info: {[player_id: string]: {plan_name: 'practice' | 'adventure'}},
            challenge_selection_info: {[player_id: string]: string},
            player_rank_info: {[key in '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8']: string},
            challenge_order: {challenger: string, rank: string, winner: 'challenger' | 'target' | 'draw' | null}[],
            challenge_index: number,
            rank_award_info: {
                round_set: 0 | 1,
                inited: 0 | 1,
                award_map: {[index: number]: {name: string, player_id: string}}
            },
            player_score: {[player_id: string]: {dead: 0 | 1, time: number}},
            game_finished: 0 | 1
        },
    },
    player_ability_info: {
        ability_info: {
            book_map: {[player_id: string]: {[book_name: string]: number}}
            ability_points: {[player_id: string]: number},
            ability_level_map: {[player_id: string]: {[ability_name: string]: {learned: 0 | 1, level: number, max_level: number}}}
        }
    },
    player_battle_info: {
        battle_info: {
            [player_id: string]: {unit_stats: {[unit_name: string]: {num: number, killed: number}}, score: number}
        }
    },
    vector_targeting: any
}
