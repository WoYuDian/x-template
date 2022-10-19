import React, { Children, EventHandler } from 'react';
import { CustomTableType } from '../common_type'
import * as realmConf from '../../../../../game/scripts/src/game_logic/configuration/realm_conf.json'

interface props {
    setAbilityPanelVisible: Function,
    setRankAwardPanelVisible: Function,
    playerInfo: CustomTableType<'player_info', 'player_map'>[keyof CustomTableType<'player_info', 'player_map'>] | null
    showRankAwardPanel: boolean
}

interface state {
    selectedBook: string | null
}

export class MenuPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

        this.toggleAbilityPanel = this.toggleAbilityPanel.bind(this)
        this.breakRealm = this.breakRealm.bind(this)
        this.toggleRankAwardPanel = this.toggleRankAwardPanel.bind(this)
    }    

    render() {       
        const buttons = [] 

        buttons.push(<Label onactivate={this.toggleRankAwardPanel} key="rank_award_panel" style={{margin: '10px 0 0 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#current_rank_award'></Label>)
        buttons.push(<Label onactivate={this.toggleAbilityPanel} key="ability_panel" style={{margin: '10px 0 0 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#ability_panel'></Label>)
        
        if(this.props.playerInfo) {
            const level = this.props.playerInfo.level;
            if(((level == realmConf.zhuji.level) || (level == realmConf.jindan.level) || (level == realmConf.yuanying.level)) && (level < 23)) {                
                buttons.push(<Label onactivate={this.breakRealm} key="break_realm" style={{margin: '10px 0 0 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#break_realm'></Label>)
            }
        }
        return <Panel style={{position: '358px 85% 0', flowChildren: 'down', zIndex: 1}}>            
            {buttons}
        </Panel>
    }

    toggleAbilityPanel() {
        this.props.setAbilityPanelVisible(true)
    }

    breakRealm() {
        GameEvents.SendCustomGameEventToServer('player_break_realm', {playerId: Game.GetLocalPlayerID()})
    }

    toggleRankAwardPanel() {
        this.props.setRankAwardPanelVisible(!this.props.showRankAwardPanel)
    }
 
}

