import * as configuration from './configuration/game_state.json'
import { stateKeyType } from '../common_type'

const cycleRoundNum = 2 * (configuration.practice_round_num_before_rank * configuration.rank_round_num_before_cycle + configuration.rank_round_num_before_cycle + 1);
const rankRoundNum = 2 * (configuration.practice_round_num_before_rank + 1)
export function getRoundInfo(roundCount: number) {
    let roundInfo: {round_name: stateKeyType<'state'>} = {round_name: 'hero_selection'}

    if(roundCount == 0) {
        roundInfo.round_name = 'hero_selection'
    } else {
        const roundNumInCycle = roundCount % cycleRoundNum;        
        const roundInRank = roundNumInCycle % rankRoundNum;
        const isPrepare = (roundCount % 2) == 1
            
        if(((roundNumInCycle == 0) || (roundNumInCycle > (rankRoundNum * configuration.rank_round_num_before_cycle)))) {
            
            if(isPrepare) {
                roundInfo.round_name = 'cycle_prepare'
            } else {
                roundInfo.round_name = 'cycle_in_progress'
            }            
        } else if ((roundInRank == 0) || (roundInRank > (configuration.practice_round_num_before_rank * 2))) {
            if(isPrepare) {
                roundInfo.round_name = 'rank_prepare'
            } else {
                roundInfo.round_name = 'rank_in_progress'
            }
        } else {
            if(isPrepare) {
                roundInfo.round_name = 'practice_prepare'
            } else {
                roundInfo.round_name = 'practice_in_progress'
            }
        }
    }

    return roundInfo
}