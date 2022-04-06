import React, { EventHandler } from 'react';

interface props {
    gameTime: number,
    gameState: string
}

export class GameStateBar extends React.Component<any, props> {
    constructor(props: props) {
        super(props)
    }

    render() {
        return <Panel style={{flowChildren: 'down',  position: '45% 50px 0', width: '10%', height: '100px', textAlign: 'center', padding: '10px 0', fontSize: '30px'}}>
            <Label style={{width: '100%', textAlign: 'center'}} key={this.props.gameState} localizedText={'#' + this.props.gameState}>            
            </Label>
            <Label style={{width: '100%', textAlign: 'center'}} text={this.props.gameTime.toFixed(0)}>            
            </Label>        
        </Panel>
        
    }
}

