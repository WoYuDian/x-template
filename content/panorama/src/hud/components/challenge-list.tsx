import React, { Children, EventHandler } from 'react';
import { CustomTableType, userNameMap, RankNumber } from '../common_type'

interface props {
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    userNameMap: userNameMap | null
}

export class ChallengeList extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        const challenges = this.props.stateInfo?.challenge_order;
        let challengeList = []
        if(challenges && (this.props.stateInfo?.state == 'rank_in_progress') && (this.props.stateInfo.challenge_index > -1)) {
            for(const key in challenges) {
                let bgColor = (this.props.stateInfo.challenge_index + 1) == parseInt(key)? '#e0c060': '#333333'
                challengeList.push(<Panel key={key} style={{ width: '100%', height: '60px', backgroundColor: bgColor, flowChildren: 'right'}}>
                    <Label style={{width: '30%', margin: '20px 5%', height: '60px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '20px', color: '#ffffff', textAlign: 'right'}} text={(this.props.userNameMap || {})[challenges[key].challenger]}></Label>
                    <Label style={{width: '20%', margin: '20px 0', height: '60px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '20px', textAlign: 'center'}} text={' vs '}></Label>
                    <Label style={{width: '30%', margin: '20px 5%', height: '60px', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '20px', color: '#ffffff', textAlign: 'left'}} text={(this.props.userNameMap || {})[this.props.stateInfo.player_rank_info[challenges[key].rank as RankNumber]]}></Label>
                </Panel>)
            }

            return <Panel hittest={false} style={{position: '0 20% 0', width: '15%', flowChildren: 'down', borderRadius: '0 10px 10px 0'}}>
                <Label localizedText={'#challenge_list'} style={{width: '100%', textAlign: 'center', color: "#e0c060", fontSize: '30px', height: '50px', padding: '10px 0', backgroundColor: '#333333'}}></Label>
                {challengeList}
            </Panel>
        } else {
            return null;
        }
    }
}


