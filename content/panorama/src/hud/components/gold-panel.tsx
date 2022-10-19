import React, { Children, EventHandler } from 'react';
import { getImageUrl } from '../../utils';
import { CustomTableType, playerAccount } from '../common_type'
import lingshiIcon from '../../images/lingshi.png'

interface props {
    playerAccount: playerAccount,
    quickBuyPosition: {x: number, y: number}
}

interface state {
    selectedBook: string | null
}

export class AccountPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)

    }    

    render() {       
        return <Panel style={{position: `${this.props.quickBuyPosition.x}px ${this.props.quickBuyPosition.y}px 0`, zIndex: 1, width: '262px', height: '60px', padding: '20px', flowChildren: 'right'}}>   
            <Label style={{color: 'white', fontSize: '20px'}} text={this.props.playerAccount.lingshi}></Label>
            <Panel style={{backgroundImage: getImageUrl(lingshiIcon), width: '30px', height: '22px', backgroundSize: '30px 22px', backgroundRepeat: 'no-repeat', marginLeft: '8px'}}></Panel>            
        </Panel>
    }
}

