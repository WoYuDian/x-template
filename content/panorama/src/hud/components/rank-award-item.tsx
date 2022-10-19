import React, { Children, EventHandler } from 'react';
import { CustomTableType, RankNumber } from '../common_type';

interface props {
    itemName: string,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null
    index: number
    playerId: string
    selectedPlayerId: string | null
    selectedUserName: string
    timeLeft: number
}

export class RankAwardItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }
    render() {        
        let operation = null;

        const playerRankInfo = this.props.stateInfo?.player_rank_info
        let selfRank = 8, selectedPlayerRank = 0;
        if(playerRankInfo) {
            for(const key in playerRankInfo) {
                if(playerRankInfo[key as RankNumber] == this.props.playerId) {
                    selfRank = parseInt(key)
                }
                if(playerRankInfo[key as RankNumber] == this.props.selectedPlayerId) {
                    selectedPlayerRank = parseInt(key)
                }
            }
        }

        if((!this.props.selectedPlayerId || (selfRank < selectedPlayerRank)) && (this.props.timeLeft > 0)) {
            operation = <Panel onactivate={e => {this.pickAward(e, this.props.index)}} style={{height: '35px', width: '100%', margin: '10px 20%', borderRadius: '8px', backgroundColor: '#e0c060'}}>
                <Label style={{color: 'white', fontSize: '20px', textAlign: 'center', width: '100%', padding: '7.5px 0'}} localizedText='#pick_award'></Label>
            </Panel>
        }

        let selectedUser = null
        if(this.props.selectedPlayerId) {
            selectedUser = <Panel style={{height: '60px', width: '100%', borderRadius: '8px', color: 'white',flowChildren: 'down', padding: '10px 10%', marginTop: '55px'}}>
                <Label style={{fontSize: '20px'}} localizedText='#picked_player'></Label>
                <Label style={{fontSize: '20px'}} text={this.props.selectedUserName}></Label>
            </Panel>
        }

        return <Panel style={{flowChildren: 'down', width: '12.5%', height: '100%', backgroundColor: '#333333', border: '1px solid #ffffff'}}>
            <DOTAItemImage style={{width: '80%', height: 'width-percentage(72.7% )', margin: '10px 10%'}} itemname={this.props.itemName} showtooltip={true}></DOTAItemImage>            
            {operation}
            {selectedUser}
        </Panel>
    }

    pickAward(e: any, index: number) {    
        GameEvents.SendCustomGameEventToServer('player_pick_award', {playerId: Game.GetLocalPlayerID(), index})
    }
}


