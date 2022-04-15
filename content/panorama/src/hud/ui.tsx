import React from 'react';
import {SelectionPanel} from './components/selection-panel'
import {GameStateBar} from './components/game-state-bar'
import { AbilityPanel } from './components/ability-panel';

import {loadAbilityGraph, getBookRoot, getBookMap, getAbilityMap} from '../../../../game/scripts/src/ability_graph/graph_loader'

loadAbilityGraph()

interface UIProps {

}

type stateInfo<
    TName extends keyof CustomNetTableDeclarations,
    T extends keyof CustomNetTableDeclarations[TName]
    > = CustomNetTableDeclarations[TName][T]

interface UIState {
    stateInfo: stateInfo<'game_state_info', 'state_info'> | null,
    showAbilityPanel: boolean,
    bookRoot: any,
    bookMap: any
    abilityMap: any
}

export class UIBody extends React.Component<any, UIState> {
    playerId: string;
    playerInfoListenerId: NetTableListenerID
    playerHeroSelectionId: NetTableListenerID
    gameStateInfoId: NetTableListenerID

    constructor(props: any) {
        super(props);
        this.playerId = Game.GetLocalPlayerID().toString()
        this.state = {
            stateInfo: null,
            showAbilityPanel: false,
            bookRoot: getBookRoot(),
            bookMap: getBookMap(),
            abilityMap: getAbilityMap()
        }
        this.setAbilityPanelVisible = this.setAbilityPanelVisible.bind(this)
        this.clickBackground = this.clickBackground.bind(this)
    }

    render() {
        return (<Panel style={{width: '100%', height: '100%'}}>
            <AbilityPanel setAbilityPanelVisible={this.setAbilityPanelVisible} showAbilityPanel={this.state.showAbilityPanel} abilityMap={this.state.abilityMap} bookRoot={this.state.bookRoot} bookMap={this.state.bookMap}></AbilityPanel>
            <GameStateBar gameTime={this.state.stateInfo?.round_count_down || 0} gameState={this.state.stateInfo?.state || ''}></GameStateBar>
            <SelectionPanel playerId={this.playerId} stateInfo={this.state.stateInfo}></SelectionPanel>
        </Panel>)
    }

    componentDidMount() {
        const _this = this;

        this.gameStateInfoId = CustomNetTables.SubscribeNetTableListener('game_state_info', function(e) {
            const stateInfo = CustomNetTables.GetTableValue('game_state_info', 'state_info')
            _this.setState({
                stateInfo: stateInfo
            })
        })                
    }

    setAbilityPanelVisible(visible: boolean) {
        this.setState({showAbilityPanel: visible})
    }

    clickBackground() {
        this.setState({showAbilityPanel: false})
    }

    componentWillUnmount() {
        CustomNetTables.UnsubscribeNetTableListener(this.gameStateInfoId)
    }


}