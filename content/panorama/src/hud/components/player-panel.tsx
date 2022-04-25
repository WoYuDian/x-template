import React, { Children, EventHandler } from 'react';
import { CustomTableType, RankNumber } from '../common_type';
import { PlayerInfoItem } from './player-info-item'

interface props {
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
}

export class PlayerPanel extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        const playerItems = []

        const playerRank = this.props.stateInfo?.player_rank_info;
        for(const key in this.props.playerMap) {
            let curRank;
            for(const rank in playerRank) {
                if(playerRank[rank as RankNumber] == key) {
                    curRank = rank;   
                }                
            }
            playerItems.push(<PlayerInfoItem key={key} playerInfo={this.props.playerMap[key]} rank={curRank}></PlayerInfoItem>)
        }              
        
        return <Panel style={{width: '13%', position: '87% 20% 0', flowChildren: 'down'}}>
            {playerItems}
        </Panel>
    }
}