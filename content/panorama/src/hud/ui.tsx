import React from 'react';
import { SelectionPanel } from './components/selection-panel'
import { GameStateBar} from './components/game-state-bar'
import { AbilityPanel } from './components/ability-panel';
import { loadAbilityGraph, getBookRoot, getBookMap, getAbilityMap } from '../../../../game/scripts/src/ability_graph/graph_helper'
import { CustomTableType, dropMap, playerAccount, RankNumber, userNameMap } from './common_type'
import { PlayerPanel } from './components/player-panel'
import { ChallengeList } from './components/challenge-list'
import { MenuPanel } from './components/menu-panel'
import { AccountPanel } from './components/gold-panel';
import { RankAwardPanel } from './components/rank-award-panel';
import { DeathPanel } from './components/death-panel';
import { ScorePanel } from './components/score-panel';
import { loadUnitDropMap } from '../../../../game/scripts/src/game_logic/drop_helper'
import { ProgressPanel } from './components/progress-panel';
loadAbilityGraph()
interface UIProps {
}

interface UIState {
    playerMap: CustomTableType<'player_info', 'player_map'> | null,
    stateInfo: CustomTableType<'game_state_info', 'state_info'> | null,
    playerAbilityInfo: CustomTableType<'player_ability_info', 'ability_info'> | null,
    showAbilityPanel: boolean,
    showRankAwardPanel: boolean
    bookRoot: any,
    bookMap: any
    abilityMap: any,
    curRank: number,
    userNameMap: userNameMap | null,
    playerAccount: playerAccount,
    dropMap: dropMap
}

export class UIBody extends React.Component<UIProps, UIState> {
    playerId: string;
    gameStateInfoId: NetTableListenerID
    playerAbilityInfoId: NetTableListenerID
    quickBuyPosition: {x: number, y: number}
    constructor(props: any) {
        super(props);
        this.playerId = Game.GetLocalPlayerID().toString()
        this.state = {
            playerMap: null,
            stateInfo: null,
            playerAbilityInfo: null,
            showAbilityPanel: false,
            showRankAwardPanel: false,
            bookRoot: getBookRoot(),
            bookMap: getBookMap(),
            abilityMap: getAbilityMap(),
            curRank: 0,
            userNameMap: null,
            playerAccount: {lingshi: Players.GetGold(parseInt(this.playerId) as PlayerID)},
            dropMap: loadUnitDropMap()
        }
        this.setAbilityPanelVisible = this.setAbilityPanelVisible.bind(this)
        this.setRankAwardPanelVisible = this.setRankAwardPanelVisible.bind(this)
        this.clickBackground = this.clickBackground.bind(this)
        this.collectUserNames = this.collectUserNames.bind(this)

        const quickBuyPanel = $.GetContextPanel().GetParent()?.GetParent()?.GetParent()?.FindChildTraverse('shop_launcher_block')
        this.quickBuyPosition = {x: (quickBuyPanel?.GetPositionWithinWindow().x || 0),
            y: (quickBuyPanel?.GetPositionWithinWindow().y || 0) }
    }

    render() {
        if(this.state.stateInfo?.game_finished == 1) {
            return (<Panel style={{width: '80%', height: '80%', margin: '10% 10%', backgroundColor: '#333333', borderRadius: '18px'}}>
                <ScorePanel stateInfo={this.state.stateInfo} playerMap={this.state.playerMap} userNameMap={this.state.userNameMap}></ScorePanel>
            </Panel>)
        } else {
            return (<Panel hittest={false} style={{width: '100%', height: '100%'}}>
                <ChallengeList userNameMap={this.state.userNameMap} stateInfo={this.state.stateInfo}></ChallengeList>
                <PlayerPanel userNameMap={this.state.userNameMap} collectUserNames={this.collectUserNames} playerMap={this.state.playerMap} stateInfo={this.state.stateInfo}></PlayerPanel>
                <AbilityPanel playerAbilityInfo={this.state.playerAbilityInfo} playerId={Game.GetLocalPlayerID()} setAbilityPanelVisible={this.setAbilityPanelVisible} showAbilityPanel={this.state.showAbilityPanel} abilityMap={this.state.abilityMap} bookRoot={this.state.bookRoot} bookMap={this.state.bookMap}></AbilityPanel>
                <GameStateBar gameTime={this.state.stateInfo?.round_count_down || 0} gameState={this.state.stateInfo?.state || ''}></GameStateBar>
                <SelectionPanel dropMap={this.state.dropMap} userNameMap={this.state.userNameMap} curRank={this.state.curRank} playerId={this.playerId} playerMap={this.state.playerMap} stateInfo={this.state.stateInfo}></SelectionPanel>
                <MenuPanel showRankAwardPanel={this.state.showRankAwardPanel} setRankAwardPanelVisible={this.setRankAwardPanelVisible} setAbilityPanelVisible={this.setAbilityPanelVisible} playerInfo={this.state.playerMap? this.state.playerMap[this.playerId]: null}></MenuPanel>
                {/* <AccountPanel playerAccount={this.state.playerAccount} quickBuyPosition={this.quickBuyPosition}></AccountPanel> */}
                <RankAwardPanel stateInfo={this.state.stateInfo} setRankAwardPanelVisible={this.setRankAwardPanelVisible} showRankAwardPanel={this.state.showRankAwardPanel}></RankAwardPanel>
                <DeathPanel stateInfo={this.state.stateInfo}></DeathPanel>
                <ProgressPanel stateInfo={this.state.stateInfo}></ProgressPanel>
            </Panel>)
        }

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

            //@ts-ignore
            setTimeout(() => {
                _this.updateCurRank()
            }, 500);
            
        })            
        
        this.playerAbilityInfoId = CustomNetTables.SubscribeNetTableListener('player_ability_info', function(e) {
            _this.getPlayerAbilityInfo()

            //@ts-ignore
            setTimeout(() => {
                _this.updatePlayerInfo()    
            }, 500);
            
        })        

        GameEvents.Subscribe('player_money_changed', function(event: any) {
            _this.setState({
                playerAccount: {lingshi: Players.GetGold(parseInt(_this.playerId) as PlayerID)}
            })
        })
    }

    collectUserNames(userNameMap: any) {
        this.setState({userNameMap: userNameMap})
    }

    updateCurRank() {
        this.setState((state, props) => {
            const playerRank = state.stateInfo?.player_rank_info;

            if(playerRank) {
                for(const key in playerRank) {
                    if(playerRank[key as RankNumber] == this.playerId) {
                        return {curRank: parseInt(key)}
                    }
                }

                return {curRank: 0}
            } else {
                return {curRank: 0}
            }

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
    
    setRankAwardPanelVisible(visible: boolean) {
        this.setState({showRankAwardPanel: visible})
    }

    componentWillUnmount() {
        CustomNetTables.UnsubscribeNetTableListener(this.gameStateInfoId)
    }
}