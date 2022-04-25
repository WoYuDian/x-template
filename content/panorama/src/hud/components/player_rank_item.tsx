import React, { Children, EventHandler } from 'react';

interface props {
    playerInfo: {steamid: string, accountid: string, level: number | undefined},
    rank: number,
    heroName: string
}

export class PlayerRankItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        return <Panel style={{width: '8.5%', height: 'width-percentage(120%)', backgroundColor: '#333333', borderRadius: '20px', border: '1px solid #ffffff'}}>
            <DOTAHeroImage heroname={this.props.heroName} style={{width: '100%', height: 'width-percentage(100%)'}}></DOTAHeroImage>
        </Panel>
    }
}


