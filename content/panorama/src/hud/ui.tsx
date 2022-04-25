import React from 'react';
import { SelectionPanel } from './components/selection-panel'
import { GameStateBar} from './components/game-state-bar'
import { AbilityPanel } from './components/ability-panel';
import { loadAbilityGraph, getBookRoot, getBookMap, getAbilityMap } from '../../../../game/scripts/src/ability_graph/graph_helper'
import { CustomTableType } from './common_type'
import { PlayerPanel } from './components/player-panel'

loadAbilityGraph()

interface UIProps {

}

interface UIState {
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    playerAbilityInfo: CustomTableType<'player_ability_info', 'ability_info'> | null,
    showAbilityPanel: boolean,
    bookRoot: any,
    bookMap: any
    abilityMap: any
}

export class UIBody extends React.Component<any, UIState> {
    playerId: string;
    gameStateInfoId: NetTableListenerID
    playerAbilityInfoId: NetTableListenerID
    constructor(props: any) {
        super(props);
        this.playerId = Game.GetLocalPlayerID().toString()
        this.state = {
            playerMap: null,
            stateInfo: null,
            playerAbilityInfo: null,
            showAbilityPanel: false,
            bookRoot: getBookRoot(),
            bookMap: getBookMap(),
            abilityMap: getAbilityMap()
        }
        this.setAbilityPanelVisible = this.setAbilityPanelVisible.bind(this)
        this.clickBackground = this.clickBackground.bind(this)
    }

    render() {
        return (<Panel hittest={false} style={{width: '100%', height: '100%'}}>
            <PlayerPanel playerMap={this.state.playerMap} stateInfo={this.state.stateInfo}></PlayerPanel>
            <AbilityPanel playerAbilityInfo={this.state.playerAbilityInfo} playerId={Game.GetLocalPlayerID()} setAbilityPanelVisible={this.setAbilityPanelVisible} showAbilityPanel={this.state.showAbilityPanel} abilityMap={this.state.abilityMap} bookRoot={this.state.bookRoot} bookMap={this.state.bookMap}></AbilityPanel>
            <GameStateBar gameTime={this.state.stateInfo?.round_count_down || 0} gameState={this.state.stateInfo?.state || ''}></GameStateBar>
            <SelectionPanel playerId={this.playerId} playerMap={this.state.playerMap} stateInfo={this.state.stateInfo}></SelectionPanel>
        </Panel>)
    }

    componentDidMount() {
        const _this = this;

        _this.getplayerMap()
        _this.updatePlayerInfo()
        _this.getPlayerAbilityInfo()
        this.gameStateInfoId = CustomNetTables.SubscribeNetTableListener('player_info', function(e) {
            _this.getplayerMap()
        })        

        this.gameStateInfoId = CustomNetTables.SubscribeNetTableListener('game_state_info', function(e) {
            const stateInfo = CustomNetTables.GetTableValue('game_state_info', 'state_info')
            _this.setState({
                stateInfo: stateInfo
            })
        })            
        
        this.playerAbilityInfoId = CustomNetTables.SubscribeNetTableListener('player_ability_info', function(e) {
            _this.getPlayerAbilityInfo()

            //@ts-ignore
            setTimeout(() => {
                _this.updatePlayerInfo()    
            }, 500);
            
        })    
    }

    getplayerMap() {
        const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')
        this.setState({
            playerMap: playerMap
        })
    }

    getPlayerAbilityInfo() {
        const playerAbilityInfo = CustomNetTables.GetTableValue('player_ability_info', 'ability_info')
        this.setState({
            playerAbilityInfo: playerAbilityInfo
        })
    }

    updatePlayerInfo() {    
        this.setState((state, props) => {
            for(const key in state.playerMap) {
                const playerLevel = Players.GetLevel(parseInt(key) as PlayerID)
                state.playerMap[key].level = playerLevel;
            }
            return {playerMap: state.playerMap}
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