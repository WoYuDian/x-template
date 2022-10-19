import React, { Children, EventHandler } from 'react';

interface props {
    playerInfo: {steamid: string, accountid: string, level: number | undefined},
    playerRank: number,
    rank: number,
    heroName: string,
    playerId: string,
    userName: string,
    challengers: string[]
}

export class PlayerRankItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)
    }


    render() {
        let challengeButton;
        let challengers = [];
        if(((this.props.playerRank - this.props.rank) <= 3) && (this.props.rank < this.props.playerRank)) {
            challengeButton = <Label onactivate={e => {this.challengePlayer(e, this.props.playerId)}} style={{margin: '10px 25%', padding: '8px 0', borderRadius: '10px', width: '50%', textAlign: 'center', fontSize: '20px', color: '#ffffff', backgroundColor: '#e0c060'}} localizedText='#challenge'></Label>
        }
        for(const userName of this.props.challengers) {
            challengers.push(<Label text={userName} key={userName} style={{color: '#e0c060', fontSize: '16px', textAlign: 'center', width: '100%', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}></Label>)
        }
        

        return <Panel style={{flowChildren: 'down', margin: '20px 0', width: 'fill-parent-flow(1.0)', minWidth: '12.5%', height: 'width-percentage(350%)', backgroundColor: '#333333', border: '1px solid #ffffff'}}>
            <Panel style={{color: '#e0c060', fontSize: '20px', width: '80%', margin: '10px 10%', flowChildren: 'right'}}>
                <Label style={{width: '100%', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} text={this.props.userName}></Label>
            </Panel>
            <DOTAHeroImage heroname={this.props.heroName} style={{borderRadius: '10px', margin: '10px 10%', width: '80%', height: 'width-percentage(72.7%)'}}></DOTAHeroImage>
            <Panel style={{color: '#e0c060', fontSize: '20px', width: '80%', margin: '10px 10%', flowChildren: 'right'}}>
                <Label style={{width: '60%', textAlign: 'right', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} localizedText='#player_rank'></Label>
                <Label style={{width: '40%', textAlign: 'left'}} text={this.props.rank}></Label>
            </Panel>
            <Panel style={{color: '#e0c060', fontSize: '20px', width: '80%', margin: '10px 10%', flowChildren: 'right'}}>
                <Label style={{width: '60%', textAlign: 'right', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} localizedText='#player_level'></Label>
                <Label style={{width: '40%', textAlign: 'left'}} text={this.props.playerInfo.level}></Label>
            </Panel>     
            <Panel style={{height: '60px', width: '100%', color: '#ffffff'}}>
                {challengeButton}
            </Panel>   
            
            <Panel style={{width: '80%', margin: '10px 10%', flowChildren: 'down'}}>
                <Label style={{width: '100%', textAlign: 'center', color: '#e0c060', fontSize: '20px', marginBottom: '10px'}} localizedText='#challengers'></Label>
                {challengers}
            </Panel>
        </Panel>
    }

    challengePlayer(e: any, playerId: string) {
        GameEvents.SendCustomGameEventToServer('player_challenge_selection', {playerId: Game.GetLocalPlayerID(), targetPlayerId: parseInt(playerId) as PlayerID})
    }
}


