import React, { Children, EventHandler } from 'react';

interface props {
    line: {from: {x: number, y: number}, to: {x: number, y: number}, color?: string, lineWidth?: string}
}

export class Line extends React.Component<props, any> {
    lineParam: any
    constructor(props: props) {
        super(props)
       
        const {from, to, color, lineWidth} = this.props.line;
        const distance = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))        
        let rotateDeg = ((Math.atan((to.y - from.y) / (to.x - from.x))) * 180 / Math.PI);
        if(rotateDeg < 0) {
            rotateDeg = 180 + rotateDeg
        } 

        this.lineParam = {
            length: distance, 
            rotateDeg: rotateDeg, 
            color: color || '#e0c060', 
            lineWidth: lineWidth || '3', 
            position: `${from.x}px ${from.y}px 0`}

    }

    render() {
        return <Panel style={{
            position: this.lineParam.position,
            width: `${this.lineParam.length}px`, 
            height: `${this.lineParam.lineWidth}px`, 
            backgroundColor: `${this.lineParam.color}`, 
            transformOrigin: '0 50%',
            transform: `rotateZ(${this.lineParam.rotateDeg}deg)` }}>       
            {/* , 
                      */}
        </Panel>
    }
}

