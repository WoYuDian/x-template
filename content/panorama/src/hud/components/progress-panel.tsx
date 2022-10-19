import React, { Children, EventHandler } from 'react';
import { CustomTableType } from '../common_type'
import { getRoundInfo } from  '../../../../../game/scripts/src/game_logic/state_helper'

interface props {
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null
}

interface state {
}

export class ProgressPanel extends React.Component<props, state> {
    stepNum: number = 5
    constructor(props: props) {
        super(props)

    }    

    render() {       
        const rounds = [<Panel></Panel>]
        const curRoundCount = this.props.stateInfo?.round_count || 0;
        
        for(let i = -this.stepNum; i <= this.stepNum; i++) {            
            let roundCount = i * 2 + curRoundCount;
            if(roundCount < -1) continue;
            roundCount = (roundCount < 0)? 0: roundCount
            const roundInfo = getRoundInfo(roundCount)
            
            let fontSize, backgroundColor, height, margin, padding, width;
            width = '60px'
            if(i == 0) {
                fontSize = '20px'
                backgroundColor = 'orange'
                height = '40px'
                margin = '0 0'
                padding = '10px 0'
            } else {
                fontSize = '15px'
                backgroundColor = '#333333'
                height = '30px'
                margin = '5px 0'
                padding = '7.5px 0'
            }
            if(roundInfo.round_name == 'hero_selection') {
                rounds.push(<Label key={roundCount + roundInfo.round_name} localizedText='#hero_selection' style={{padding: padding, textAlign: 'center', fontSize: fontSize, color: 'white', backgroundColor: backgroundColor, borderRadius: '5px', width: width, height: height, margin: margin}}>
                </Label>)
            } else if ((roundInfo.round_name == 'cycle_in_progress') || (roundInfo.round_name == 'cycle_prepare')) {
                rounds.push(<Label key={roundCount + roundInfo.round_name} localizedText='#cycle_tag' style={{padding: padding, textAlign: 'center', fontSize: fontSize, color: 'white', backgroundColor: backgroundColor, borderRadius: '5px', width: width, height: height, margin: margin}}>
                </Label>)
            } else if ((roundInfo.round_name == 'rank_in_progress') || (roundInfo.round_name == 'rank_prepare')) {
                rounds.push(<Label key={roundCount + roundInfo.round_name} localizedText='#rank_tag' style={{padding: padding, textAlign: 'center', fontSize: fontSize, color: 'white', backgroundColor: backgroundColor, borderRadius: '5px', width: width, height: height, margin: margin}}>
                </Label>)
            } else if ((roundInfo.round_name == 'practice_in_progress') || (roundInfo.round_name == 'practice_prepare')) {
                rounds.push(<Label key={roundCount + roundInfo.round_name} localizedText='#practice_tag' style={{padding: padding, textAlign: 'center', fontSize: fontSize, color: 'white', backgroundColor: backgroundColor, borderRadius: '5px', width: width, height: height, margin: margin}}>
                </Label>)
            }

            if(i < this.stepNum) {
                rounds.push(<Panel key={roundCount + 'line'} style={{margin: '18.5px 2px', width: '20px', height: '3px', backgroundColor: '#333333'}}></Panel>)
            }
        }

        return <Panel style={{width: '50%', height: '40px', margin: '0 25%', position: '0 80% 0', flowChildren: 'right'}} hittest={false}>
            {rounds}
        </Panel>
    }

}

