import React, { Children, EventHandler } from 'react';

interface props {
    ability: any
    styleConf: any,
    id: string
}

export class AbilityGraphItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }

    render() {
        return <DOTAAbilityImage id={this.props.id} style={{borderRadius: '15px', height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`, position: `${this.props.ability.position.x}% ${this.props.ability.position.y}px 0`}} abilityname={this.props.ability.ability_name}></DOTAAbilityImage>
    }
}

