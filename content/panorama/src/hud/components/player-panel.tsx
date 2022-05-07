import React, { Children, EventHandler } from 'react';
import { CustomTableType, RankNumber, userNameMap } from '../common_type';
import { PlayerInfoItem } from './player-info-item'

interface props {
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    collectUserNames: Function,
    userNameMap: userNameMap | null
}

export class PlayerPanel extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        const playerItems = []
        const playerRankArr = []
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
        
        playerItems.sort(function(a, b) { return a.props.rank - b.props.rank})

        if($('#player_info_panel') && !this.props.userNameMap) {
            this.collectUserNames()
        }
        
        return <Panel id='player_info_panel' style={{width: '13%', position: '87% 20% 0', flowChildren: 'down'}}>
            {playerItems}
        </Panel>
    }

    collectUserNames() {
        let userNameMap: userNameMap | null = null;

        for(const key in this.props.playerMap) {
            const userName = $('#' + this.props.playerMap[key].steamid)

            if(userName) {
                const label: any = userName.GetChild(0);
                if(label) {
                    if(!userNameMap) {
                        userNameMap = {}
                    }

                    userNameMap[key] = label.text || ''
                }
            }
            
        }

        if(userNameMap) {
            this.props.collectUserNames(userNameMap)
        }
        
    }
}