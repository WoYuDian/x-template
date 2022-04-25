import React, { EventHandler } from 'react';
import { CustomTableType, RankNumber } from '../common_type'
import { PlayerRankItem } from './player_rank_item'


interface props {
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    playerId: string,
    playerMap: CustomTableType<'player_info', 'player_map'> | null
}

interface state {
    curRank: number
}

export class SelectionPanel extends React.Component<props, state> {
    constructor(props: props) {
        super(props)
        this.selectHero = this.selectHero.bind(this)
        this.selectPlan = this.selectPlan.bind(this)
        this.selectRelic = this.selectRelic.bind(this)

        this.state = {
            curRank: 0            
        }
    }

    render() {
        const heroPool = this.props.stateInfo?.player_hero_pool[this.props.playerId] || null
        const selectedHero = this.props.stateInfo?.hero_selection_info[this.props.playerId] || null;
        
        let selectionContent;
        if(heroPool && !selectedHero) {            
            let heroCards = []
            for(const key in heroPool) {
                heroCards.push(<DOTAHeroMovie onmouseactivate={this.selectHero} onmouseover={this.mouseOver} onmouseout={this.mouseOut} style={{height: 'width-percentage(150%)', width: '20%',margin: '10% 6.6%',transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%'}} key={key} heroname={heroPool[key]}></DOTAHeroMovie>)
            }

            selectionContent = heroCards;

        } else {
            const gameState = this.props.stateInfo?.state;

            let selections = []
            if(gameState == 'practice_prepare') {
                const planSelectionInfo = this.props.stateInfo?.plan_selection_info;
                const relicSelectionInfo = this.props.stateInfo?.relic_selection_info;
                if(!planSelectionInfo || !planSelectionInfo[this.props.playerId]) {
                    selections.push(<DOTAAbilityImage onmouseactivate={e => {this.selectPlan(e, 'practice')}} key={'practice'} onmouseover={this.mouseOver} onmouseout={this.mouseOut} style={{height: 'width-percentage(100%)', width: '30%',margin: '10% 10%',transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%'}} abilityname='elder_titan_return_spirit'></DOTAAbilityImage>)
                    selections.push(<DOTAAbilityImage onmouseactivate={e => {this.selectPlan(e, 'adventure')}} key={'adventure'} onmouseover={this.mouseOver} onmouseout={this.mouseOut} style={{height: 'width-percentage(100%)', width: '30%',margin: '10% 10%',transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%'}} abilityname='slark_pounce'></DOTAAbilityImage>)
                } else if ((!relicSelectionInfo || !relicSelectionInfo[this.props.playerId]) && (planSelectionInfo[this.props.playerId].plan_name == 'adventure')) {
                    const relicSelections = this.props.stateInfo?.player_relic_selections[this.props.playerId].relic_selections;
                    for(const key in relicSelections) {

                        const relicInfo = relicSelections[key]
                        selections.push(<DOTAAbilityImage onmouseactivate={e => {this.selectRelic(e, relicInfo.relic_name)}} key={relicInfo.relic_name} onmouseover={this.mouseOver} onmouseout={this.mouseOut} style={{height: 'width-percentage(100%)', width: '20%',margin: '10% 6.50%',transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%'}} abilityname={relicInfo.texture_src}></DOTAAbilityImage>)
                    }                    
                }
            } else if (gameState == 'rank_prepare') {
                const challengeSelectionInfo = this.props.stateInfo?.challenge_selection_info;
                const playerRank = this.props.stateInfo?.player_rank_info;
                const heroSelectionInfo = this.props.stateInfo?.hero_selection_info;
   
                if((!challengeSelectionInfo || !challengeSelectionInfo[this.props.playerId]) && (playerRank && playerRank['1']) && this.props.playerMap && heroSelectionInfo) {
                    for(let i = 1; i <= 8; i++) {
                        if(playerRank[i.toString() as RankNumber]) {
                            selections.push(<PlayerRankItem key={i} rank={this.state.curRank} heroName={heroSelectionInfo[playerRank[i.toString() as RankNumber]].hero_name} playerInfo={this.props.playerMap[playerRank[i.toString() as RankNumber]]}></PlayerRankItem>)
                        }
                        
                    }
                }
            }
            selectionContent = selections
        }

        return <Panel hittest={false} style={{flowChildren: 'right', width: '60%', height: '40%', margin: '30% 20%', textAlign: 'center', padding: '0 50px'}}>
            {selectionContent}
        </Panel>
        
    }

    mouseOver(e: HeroMovie | AbilityImage) {
        if(e.paneltype == 'FOTAAbilityImage') {
            e.style.transform = 'scale3d(1.1, 1.1, 1)'
        } else {
            e.style.transform = 'scale3d(1.1, 1.1, 1)'
        }
    }

    mouseOut(e: HeroMovie | AbilityImage) {
        e.style.transform = 'translateZ(0)'
    }

    selectHero(e: HeroMovie) {
        GameEvents.SendCustomGameEventToServer('player_hero_selection', {heroName: e.heroname, playerId: Game.GetLocalPlayerID()})
    }

    selectPlan(e: AbilityImage, planName:string) {
        GameEvents.SendCustomGameEventToServer('player_plan_selection', {planName: planName, playerId: Game.GetLocalPlayerID()})
    }

    selectRelic(e: AbilityImage, relicName:string) {
        GameEvents.SendCustomGameEventToServer('player_relic_selection', {relicName: relicName, playerId: Game.GetLocalPlayerID()})
    }
}

