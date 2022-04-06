import React from 'react';
import {SelectionPanel} from './components/selection-panel'
import {GameStateBar} from './components/game-state-bar'

interface UIProps {

}

type stateInfo<
    TName extends keyof CustomNetTableDeclarations,
    T extends keyof CustomNetTableDeclarations[TName]
    > = CustomNetTableDeclarations[TName][T]

interface UIState {
    stateInfo: stateInfo<'game_state_info', 'state_info'> | null
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
            // heroPool: {'1': 'npc_dota_hero_elder_titan'},
            stateInfo: null
        }
    }

    render() {
        return (<Panel style={{width: '100%', height: '100%'}}>
            <GameStateBar gameTime={this.state.stateInfo?.round_count_down || 0} gameState={this.state.stateInfo?.state || ''}></GameStateBar>
            <SelectionPanel playerId={this.playerId} stateInfo={this.state.stateInfo}></SelectionPanel>
        </Panel>)
    }

    componentDidMount() {
        const _this = this;
        // this.playerInfoListenerId = CustomNetTables.SubscribeNetTableListener('player_info', function(e) {
        //     const data = CustomNetTables.GetTableValue('player_info', 'player_hero_pool')
        //     if(data && data[_this.playerId]) {
        //         const heroPool = data[_this.playerId]
        //         _this.setState({heroPool: heroPool})
        //     }
        // })

        // this.playerHeroSelectionId = CustomNetTables.SubscribeNetTableListener('hero_selection', function(e) {
        //     const data = CustomNetTables.GetTableValue('hero_selection', 'hero_selection_info')
        //     if(data && data[_this.playerId].hero_name) {
        //         _this.setState({selectedHero: data[_this.playerId].hero_name})
        //     }
        // })

        this.gameStateInfoId = CustomNetTables.SubscribeNetTableListener('game_state_info', function(e) {
            const stateInfo = CustomNetTables.GetTableValue('game_state_info', 'state_info')
            _this.setState({
                stateInfo: stateInfo
            })
        })
        
        
    }

    componentWillUnmount() {
        CustomNetTables.UnsubscribeNetTableListener(this.gameStateInfoId)
    }
}