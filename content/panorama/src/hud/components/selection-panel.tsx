import React, { EventHandler } from 'react';
import { CustomTableType, dropMap, RankNumber, userNameMap } from '../common_type'
import { PlayerRankItem } from './player_rank_item'
import { RankAwardItem } from './rank-award-item';
import * as stateConfiguration from  '../../../../../game/scripts/src/game_logic/configuration/game_state.json'
import * as unitComposition from '../../../../../game/scripts/src/game_logic/configuration/unit_composition.json'

type relicKey = keyof typeof unitComposition
import { loadHeroMap } from '../../../../../game/scripts/src/game_logic/hero_helper'
const heroMap: any = loadHeroMap()

interface props {
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    playerId: string,
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    curRank: number,
    userNameMap: userNameMap | null,
    dropMap: dropMap
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
    }

    render() {
        const heroPool = this.props.stateInfo?.player_hero_pool[this.props.playerId] || null
        const selectedHero = this.props.stateInfo?.hero_selection_info[this.props.playerId] || null;
        
        let selectionContent;
        if(heroPool && !selectedHero) {
            let heroCards = []
            for(const key in heroPool) {
                const abilities = []
                for(const ability of heroMap[heroPool[key]].abilities) {
                    abilities.push(<DOTAAbilityImage style={{borderRadius: '5px', width: `${(100 / heroMap[heroPool[key]].abilities.length) - 4 / heroMap[heroPool[key]].abilities.length}%`, height: 'width-percentage(100%)', margin: `0 ${2 / heroMap[heroPool[key]].abilities.length}%`}} abilityname={ability} showtooltip={true}></DOTAAbilityImage>)
                }
                heroCards.push(
                <Panel onactivate={e => {this.selectHero(heroPool[key])}} onmouseover={this.mouseOver} onmouseout={this.mouseOut} key={key}
                    style={{backgroundColor: '#333333', borderRadius: '10px', flowChildren: 'down', height: 'width-percentage(150%)', width: '20%',margin: '10% 6.6%',transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%'}}>
                    <Label style={{width: '100%', textAlign: 'center', fontSize: '20px', color: 'white', margin: '20px 0 0 0'}} localizedText={`#${heroPool[key]}`}></Label>                        
                    <DOTAHeroImage style={{width: '80%', height: 'width-percentage(72.7%)', margin: '10px 10%'}}
                        heroname={heroPool[key]}></DOTAHeroImage>
                    <Label style={{width: '100%', textAlign: 'center', fontSize: '20px', color: 'white'}} localizedText="#innate_ability"></Label>
                    <Panel style={{width: `${(heroMap[heroPool[key]].abilities.length * 40)}%`, flowChildren: 'right', margin: `10px ${(100 - (heroMap[heroPool[key]].abilities.length * 40)) / 2}%`}}> 
                        {abilities}
                    </Panel>
                </Panel>)
                
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
                        const items: string[] = []
                        const units = unitComposition[relicInfo.relic.relic_name as relicKey].units
                        for(const unit of units) {
                            const drops = this.props.dropMap[unit.name]?.drops || []
                            for(const key in drops) {
                                if(items.indexOf(key) > -1) continue

                                items.push(key)
                            }
                        }

                        const columnPerRow = 5
                        const rows = []
                        let itemsIcons = []
                        let curColumn = 0
                        for(const item of items) {
                            curColumn += 1
                            itemsIcons.push(<DOTAItemImage itemname={item} key={`${item}_${relicInfo.relic.relic_name}`}
                                style={{width: '18%', margin: '0 1%', height: 'width-percentage(72.7%)', borderRadius: '5px'}}
                            ></DOTAItemImage>)

                            if(curColumn >= columnPerRow) {
                                curColumn = 0
                                rows.push(<Panel style={{flowChildren: 'right', width: '90%', margin: '2% 5%'}}>
                                    {itemsIcons}
                                </Panel>)

                                itemsIcons = []
                            }                        
                        }
                        if(itemsIcons.length > 0) {
                            rows.push(<Panel style={{flowChildren: 'right', width: '90%', margin: '2% 5%'}}>
                                {itemsIcons}
                            </Panel>)
                        }

                        selections.push(<Panel onmouseactivate={e => {this.selectRelic(e, relicInfo.relic.relic_name, relicInfo.index)}} key={relicInfo.relic.relic_name} 
                            onmouseover={this.mouseOver} onmouseout={this.mouseOut} 
                            style={{flowChildren: 'down', height: '90%', width: '30%',margin: '10% 1.6%', borderRadius: '15px', transition: 'transform 0.2s ease-in-out 0.2s', perspectiveOrigin: '50% 50%', backgroundColor: '#333333'}}>
                            <Label style={{height: '15%', margin: '5% 0 0 0', fontSize: '30px', color: 'red', width: '100%', textAlign: 'center'}} localizedText={`#relic_${relicInfo.relic.relic_name}`}></Label>                            
                            <Panel style={{margin: '0 10% 5% 10%', width: '80%', flowChildren: 'down', border: '1px solid yellow', height: '75%'}}>
                                <Label style={{height: '20px', margin: '10px 0', fontSize: '20px', color: 'white', width: '100%', textAlign: 'center'}} localizedText="#possible_rewards"></Label>
                                {rows}
                            </Panel>
                        </Panel>)
                    }                    
                }
            } else if (gameState == 'rank_prepare') {
                const challengeSelectionInfo = this.props.stateInfo?.challenge_selection_info;
                const playerRank = this.props.stateInfo?.player_rank_info;
                const heroSelectionInfo = this.props.stateInfo?.hero_selection_info;
   
                if((playerRank && playerRank['1']) && this.props.playerMap && heroSelectionInfo) {
                    for(let i = 1; i <= 8; i++) {
                        if(playerRank[i.toString() as RankNumber]) {
                            const playerId = playerRank[i.toString() as RankNumber]
                            let challengers = []
                            for(const key in challengeSelectionInfo) {
                                
                                if(challengeSelectionInfo[key] == playerId) {                                    
                                    challengers.push(this.props.userNameMap? this.props.userNameMap[key]: '')
                                }
                            }                            
                            selections.push(<PlayerRankItem challengers={challengers} userName={this.props.userNameMap? this.props.userNameMap[playerId]: ''} key={playerId} playerId={playerId} playerRank={this.props.curRank} rank={i} heroName={heroSelectionInfo[playerId].hero_name} playerInfo={this.props.playerMap[playerId]}></PlayerRankItem>)
                        }                        
                    }
                }
            } else if ((gameState == 'rank_in_progress') && (this.props.stateInfo?.rank_award_info.round_set == 1)) {
                const rankAwards = this.props.stateInfo.rank_award_info.award_map
                const playerRankInfo = this.props.stateInfo.player_rank_info

                let selfRank = 8
                for(const key in playerRankInfo) {
                    if(playerRankInfo[key as RankNumber] == this.props.playerId) {
                        selfRank = parseInt(key)
                    }
                }

                let timeLeft = (selfRank * stateConfiguration.rank_duration / 8) - (Game.GetGameTime() - this.props.stateInfo.last_round_time)

                const items = []
                for(const key in rankAwards) {
                    items.push(<RankAwardItem 
                        stateInfo={this.props.stateInfo} 
                        key={key} 
                        index={parseInt(key)}
                        playerId={this.props.playerId} 
                        selectedPlayerId={rankAwards[key].player_id || null} 
                        selectedUserName={this.props.userNameMap? this.props.userNameMap[rankAwards[key].player_id]: ''}
                        itemName={rankAwards[key].name}
                        timeLeft={timeLeft}
                        ></RankAwardItem>)
                }

                const content = <Panel style={{width: '100%', height: '100%', backgroundColor: '#333333', flowChildren: 'down', borderRadius: '10px'}}>
                    <Panel style={{width: '100%', height: '15%', flowChildren: 'right', padding: '20px 30% 0 30%'}}>
                        <Label style={{fontSize: '30px', color: 'white', width: '100%', textAlign: 'center'}} localizedText='#rank_award_pick_note'></Label>
                    </Panel>
                    <Panel style={{width: '100%', height: '15%', flowChildren: 'right', padding: '10px 40% 0 40%'}}>
                        <Label style={{fontSize: '30px', color: 'white', width: '70%'}} localizedText='#pick_time_left'></Label>
                        <Label style={{fontSize: '30px', color: 'white', width: '30%'}} text={timeLeft > 0? timeLeft.toFixed(0): 0}></Label>
                    </Panel>
                    <Panel style={{width: '100%', height: '70%', flowChildren: 'right'}}>
                        {items}
                    </Panel>                    
                </Panel>

                selections.push(content)
            }
            selectionContent = selections
        }

        return <Panel hittest={false} style={{flowChildren: 'right', width: '60%', height: '40%', margin: '30% 20%', textAlign: 'center', padding: '0 50px'}}>
            {selectionContent}
        </Panel>
        
    }

    mouseOver(e: HeroMovie | Panel) {
        if(e.paneltype == 'FOTAAbilityImage') {
            e.style.transform = 'scale3d(1.1, 1.1, 1)'
        } else {
            e.style.transform = 'scale3d(1.1, 1.1, 1)'
        }
    }

    mouseOut(e: HeroMovie | Panel) {
        e.style.transform = 'translateZ(0)'
    }

    selectHero(heroName: string) {
        GameEvents.SendCustomGameEventToServer('player_hero_selection', {heroName: heroName, playerId: Game.GetLocalPlayerID()})
    }

    selectPlan(e: Panel, planName:string) {
        GameEvents.SendCustomGameEventToServer('player_plan_selection', {planName: planName, playerId: Game.GetLocalPlayerID()})
    }

    selectRelic(e: Panel, relicName:string, index: number) {
        GameEvents.SendCustomGameEventToServer('player_relic_selection', {relicName: relicName, playerId: Game.GetLocalPlayerID(), index: index})
    }
}

