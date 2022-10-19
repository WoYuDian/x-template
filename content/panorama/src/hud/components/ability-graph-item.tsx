import React, { Children, EventHandler } from 'react';

interface props {
    ability: any
    styleConf: any,
    id: string,
    state: any
}

export class AbilityGraphItem extends React.Component<props, any> {
    maxLevel: number
    constructor(props: props) {
        super(props)

        this.upgradeAbility = this.upgradeAbility.bind(this)
        this.maxLevel = -1;
    }

    render() {
        if((this.props.state.level > -1) && (this.maxLevel == -1)) {
            this.initAbilityState()
        }

        const operationBoxHeight = ((this.props.styleConf.height - 100) * 0.7 / this.props.styleConf.height) * 100 + '%';
        let upgradeButton = null; 

        if(this.props.state.learnable && ((this.maxLevel > this.props.state.level) || (this.props.state.level == 0))) {
            upgradeButton = <Panel onactivate={e => {this.upgradeAbility(e, this.props.ability.ability_name)}} style={{flowChildren: 'right', width: '100%', height: operationBoxHeight, textAlign: 'center'}}>
                <Label text={'+'} style={{borderRadius: '10px 10px 0 0', backgroundColor: '#e0c060', width: '100%',  fontSize: '20px', fontWeight: 'bold', color: '#ffffff', textAlign: 'center'}}></Label>                
            </Panel>
        }

        let levelBarBox = null;
        if(this.maxLevel > 0) {
            const levelBars = []
            const levelBarWidth = ((100 / this.maxLevel) - 2).toFixed(2) + '%'
            for(let i = 0; i < this.maxLevel; i++) {
                let barColor;
                if(this.props.state.level >= (i + 1)) {
                    barColor = '#e0c060'
                } else {
                    barColor = '#333333'
                }
                levelBars.push(<Panel key={i} style={{margin: '0 1%', border: '1px solid #e0c060',backgroundColor: barColor, width: levelBarWidth, height: '100%'}}></Panel>)
            }
            const levelBarBoxHeightValue = ((this.props.styleConf.height - 100) * 0.3 / this.props.styleConf.height) * 100;
            const levelBarBoxPositionY = (100 - levelBarBoxHeightValue) + '%'
            levelBarBox = <Panel style={{marginTop: '1%',width: '100%', height: levelBarBoxHeightValue + 'px', position: `0 ${levelBarBoxPositionY} 0`, flowChildren: 'right'}}>
                {levelBars}
            </Panel>
        }

        return <Panel id={this.props.id} style={{ height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`,
            position: `${this.props.ability.position.x}% ${this.props.ability.position.y}px 0`}}>
            {upgradeButton}
            <DOTAAbilityImage showtooltip={true} style={{position: `0 ${operationBoxHeight} 0`, borderRadius: '10px', width: '100%', height: 'width-percentage(100%)'}} abilityname={this.props.ability.ability_name}></DOTAAbilityImage>
            {levelBarBox}
        </Panel>
    }

    initAbilityState() {        
        const heroIndex = Players.GetPlayerHeroEntityIndex(Game.GetLocalPlayerID());
        const ability = Entities.GetAbilityByName(heroIndex, this.props.ability.ability_name)
        this.maxLevel = Abilities.GetMaxLevel(ability)
    }

    upgradeAbility(e: any, abilityName: string) {
        GameEvents.SendCustomGameEventToServer('player_upgrade_ability', {abilityName: abilityName, playerId: Game.GetLocalPlayerID()})
    }
}

