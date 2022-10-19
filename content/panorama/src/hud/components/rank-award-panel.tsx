import React, { Children, EventHandler } from 'react';
import { CustomTableType } from '../common_type'


interface props {
    setRankAwardPanelVisible: Function,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null
    showRankAwardPanel: boolean
}

interface state {
}

export class RankAwardPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

        this.closePanel = this.closePanel.bind(this)
    }    

    render() {       
        if(!this.props.showRankAwardPanel) return null;
        // if(this.props)
        const rankAwardInfo = this.props.stateInfo?.rank_award_info.award_map;        
        if(!rankAwardInfo) return null;

        const items = []
        for(let i = 1; i <= 8; i++) {
            if(!rankAwardInfo[i]) continue;
            items.push(<Panel style={{width: '12.5%', height: '100%', border: '1px solid #ffffff'}}>
                <DOTAItemImage style={{width: '80%', margin: '20px 10%', height: 'width-percentage(72.7% )'}} showtooltip={true} itemname={rankAwardInfo[i].name}></DOTAItemImage>
            </Panel>)
        }
        return <Panel style={{flowChildren: 'down', width: '60%', height: '30%', margin: '35% 20%', textAlign: 'center', padding: '0 50px', backgroundColor: '#333333', borderRadius: '10px'}}> 
            <Panel style={{width: '100%', height: '40%',}}>
                <Label localizedText='#current_rank_award_text' style={{fontSize: '30px', width: '100%', padding: '10px 35%', textAlign: 'center', color: 'white'}}></Label>
                <Label onactivate={e => {this.closePanel()}} localizedText='#close_current_rank_award_panel' style={{position: '93% 20% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '5px', fontSize: '20px'}}></Label>
            </Panel> 
            <Panel style={{width: '100%', height: '40%', flowChildren: 'right'}}>
                {items}
            </Panel>                      
        </Panel>
    }

    closePanel() {
        this.props.setRankAwardPanelVisible(false)
    }
}

