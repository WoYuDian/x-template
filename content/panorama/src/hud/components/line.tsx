import React, { Children, EventHandler } from 'react';

interface props {
    line: {from: {x: number, y: number}, to: {x: number, y: number}, color?: string, lineWidth?: string}
}

export class Line extends React.Component<props, any> {
    lineParam: any
    constructor(props: props) {
        super(props)
       
        const {from, to, color, lineWidth} = this.props.line;
        const distance = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y, to.y))
        const rotateDeg = Math.asin((to.y - from.y) / distance);
        this.lineParam = {
            length: distance, 
            rotateDeg: (rotateDeg*360/Math.PI).toFixed(0), 
            color: color || '#ffffff', 
            lineWidth: lineWidth || '1', 
            position: `${from.x}px ${from.y}px 0`}

    }

    render() {
        return <Panel style={{
            position: this.lineParam.position,
            width: `${this.lineParam.length}px`, 
            height: `${this.lineParam.lineWidth}px`, 
            backgroundColor: `${this.lineParam.color}`, 
            transformOrigin: '100% 50%' }}>       
            {/* , 
            transform: `rotateZ(${this.lineParam.rotateDeg}deg)`          */}
        </Panel>
    }
}

