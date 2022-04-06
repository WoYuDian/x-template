declare interface CustomNetTableDeclarations {
    hero_pool: {
        pool: string[];
    };
    player_info: {
        player_map: {},
    };
    player_configuration: {
        player_location: {[player_id: string]: {center: {x: number, y: number, z: number}}}
    }
    game_state_info: {
        state_info: {
            last_round_time: number,
            time_from_last_round: number, 
            state: string, 
            round_count_down: number, 
            round_count: number, 
            round_inited: 0 | 1, 
            round_type: 'cycle' | 'rank' | 'practice' | 'hero_selection',
            is_prepare: 0 | 1,
            player_relic_selections: {[playerId: string]: {relic_selections: {[key: string]: {texture_src: string, relic_name: string}}}}    
            player_hero_pool: {[key: string]: {[key: string]: string}}        
            hero_selection_info: {[player_id: string]: {hero_name: string}}
            relic_selection_info: {[player_id: string]: {relic_name: string}},
            plan_selection_info: {[player_id: string]: {plan_name: 'practice' | 'adventure'}},
        },
    }
}
