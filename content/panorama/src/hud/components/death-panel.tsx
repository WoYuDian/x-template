import React, { Children, EventHandler } from 'react';
import { CustomTableType } from '../common_type'


interface props {
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null
}

interface state {
}

export class DeathPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

    }    

    render() {       
        const playerScore = this.props.stateInfo?.player_score;
        if(playerScore && playerScore[Game.GetLocalPlayerID().toString()] && (playerScore[Game.GetLocalPlayerID().toString()].dead == 1)) {
            return <Panel style={{width: '300px', height: '20%', position: '0 40% 0', backgroundColor: '#333333', borderRadius: '0 10px 10px 0'}}> 
                    <Label style={{fontSize: '40px', color: 'white', height: '20%', margin: '40% 20px'}} localizedText="#note_player_dead"></Label>
                </Panel>
        } else {
            return null
        }

        
    }

}

