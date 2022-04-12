import React, { EventHandler } from 'react';

interface props {
    bookRoot: any,
    gameState: string
}

export class AbilityPanel extends React.Component<any, props> {
    constructor(props: props) {
        super(props)
    }

    render() {          
        return <Panel id='box' style={{width: '95%', height: '95%', position: '2.5% 2.5% 11100px', backgroundColor: '#333333', zIndex: 100}}>    
        </Panel>
        
    }
}

