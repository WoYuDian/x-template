import React, { Children, EventHandler } from 'react';
import { CustomTableType } from '../common_type'


interface props {
    setAbilityPanelVisible: Function,
    playerInfo: CustomTableType<'player_info', 'player_map'>[keyof CustomTableType<'player_info', 'player_map'>] | null
}

interface state {
    selectedBook: string | null
}

export class MenuPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

        this.toggleAbilityPanel = this.toggleAbilityPanel.bind(this)
        this.breakRealm = this.breakRealm.bind(this)
    }    

    render() {       
        const buttons = [] 

        buttons.push(<Label onactivate={this.toggleAbilityPanel} key="ability_panel" style={{margin: '10px 0 0 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#ability_panel'></Label>)
        
        if(this.props.playerInfo) {
            const level = this.props.playerInfo.level;
            if((((level + 1) % 5) == 0) && (level < 15)) {                
                buttons.push(<Label onactivate={this.breakRealm} key="break_realm" style={{margin: '10px 0 0 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#break_realm'></Label>)
            }
        }
        return <Panel style={{position: '358px 90% 0', flowChildren: 'down', zIndex: 1}}>            
            {buttons}
        </Panel>
    }

    toggleAbilityPanel() {
        this.props.setAbilityPanelVisible(true)
    }

    breakRealm() {
        GameEvents.SendCustomGameEventToServer('player_break_realm', {playerId: Game.GetLocalPlayerID()})
    }
 
}

