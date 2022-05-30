import React, { Children, EventHandler } from 'react';

interface props {
    playerInfo: {steamid: string, accountid: string, level: number | undefined},
    rank: string | undefined
}

export class PlayerInfoItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        // let rankInfo = null

        // if(this.props.rank) {
        //     rankInfo = <Panel style={{marginTop: '5px', flowChildren: 'right', color: '#e0c060', fontSize: '15px'}}>
        //         <Label localizedText='#player_rank'></Label><Label text={this.props.rank}></Label>
        //     </Panel>
        // }

        let position = null
        if(this.props.rank) {
            position = `0 ${parseInt(this.props.rank) * 12.5}% 0`
        }
        return <Panel style={{position: position, border: '1px solid #ffffff', padding: '5px 5px', width: '12.5%', height: '100%', flowChildren: 'right', backgroundColor: '#333333', borderRadius: '10px'}}>
            <DOTAAvatarImage onactivate={e => {}} onmouseover={e => {}} steamid={this.props.playerInfo.steamid} style={{height: '100%', width: 'height-percentage(100%)', borderRadius: '10px'}}></DOTAAvatarImage>
            <Panel style={{flowChildren: 'down', padding: '5px 20px'}}>
                <DOTAUserName id={this.props.playerInfo.steamid} style={{textOverflow: 'ellipsis', fontSize: '20px', whiteSpace: 'nowrap', height: '20px'}} steamid={this.props.playerInfo.steamid}></DOTAUserName>
                <Panel style={{marginTop: '5px', flowChildren: 'right', color: '#e0c060', fontSize: '15px'}}>
                    <Label localizedText='#player_level'></Label><Label text={this.props.playerInfo.level || '1'}></Label>
                </Panel>          
            </Panel>
        </Panel>
    }
}


