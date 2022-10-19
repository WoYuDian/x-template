import React, { Children, EventHandler } from 'react';
import { CustomTableType, userNameMap } from '../common_type'


interface props {
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    userNameMap: userNameMap | null
}

interface state {
}

export class ScorePanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

        this.leaveGame = this.leaveGame.bind(this)
    }    

    render() {       
        const playerScore = this.props.stateInfo?.player_score;
        
        const playerArr = []
        for(const key in playerScore) {
            playerArr.push({id: key, surviveTime: playerScore[key].time})
        }

        playerArr.sort(function(a, b) {
            return b.surviveTime - a.surviveTime
        })

        const list = []
        for(let i = 0; i < playerArr.length; i++) {
            list.push(
                <Panel style={{height: '70px', flowChildren: 'right', border: '1px solid #ffffff', width: '100%'}}>
                        <Label style={{fontSize: '20px', padding: '20px', textAlign: 'center', color: 'white', width: '80px'}} text={i + 1}></Label>
                        <Panel style={{height: '100%', width: 'height-percentage(100%)', backgroundColor: '#666666'}}>
                            <DOTAAvatarImage style={{height: '100%', width: 'height-percentage(100%)'}} steamid={this.props.playerMap? this.props.playerMap[playerArr[i].id].steamid: ''}></DOTAAvatarImage>
                        </Panel>
                        <DOTAUserName style={{fontSize: '20px', padding: '20px', textAlign: 'center', color: 'white', width: '30%', textOverflow: 'ellipsis'}} steamid={this.props.playerMap? this.props.playerMap[playerArr[i].id].steamid: ''}></DOTAUserName>
                        {/* <Label text={this.props.userNameMap? this.props.userNameMap[playerArr[i].id]: ''}></Label> */}
                        <Label style={{fontSize: '20px', padding: '20px', textAlign: 'center', color: 'white'}} localizedText='#player_level'></Label>
                        <Label style={{fontSize: '20px', padding: '20px', textAlign: 'center', color: 'white'}} text={this.props.playerMap? this.props.playerMap[playerArr[i].id].level: ''}></Label>                    
                </Panel>
            )
        }

        return <Panel style={{width: '80%', margin: '20px 10%', flowChildren: 'down'}}>
            <Label style={{fontSize: '60px', color: 'white', width: '20%', margin: '20px 40%', textAlign: 'center'}} localizedText='#game_over'></Label>
            <Label style={{fontSize: '40px', color: 'white', width: '20%', margin: '10px 40%', textAlign: 'center'}} localizedText='#game_rank'></Label>
            {list}
            <Label onactivate={this.leaveGame} style={{fontSize: '25px', color: 'white', width: '10%', margin: '20px 2px 10px 90%', textAlign: 'center', border: '2px solid #ffffff', borderRadius: '10px'}} localizedText='#leave_game'></Label>
        </Panel>
    }

    leaveGame() {
        Game.Disconnect()
    }
}

