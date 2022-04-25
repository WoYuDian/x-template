import React, { Children, EventHandler } from 'react';

interface props {
    line: {from: {x: number, y: number}, to: {x: number, y: number}, color?: string, lineWidth?: string},
    id: string
}

export class Line extends React.Component<props, any> {
    lineParam: any
    constructor(props: props) {
        super(props)
        this.calcLineParam()
    }

    calcLineParam() {
        const {from, to, color, lineWidth} = this.props.line;

        from.x = parseFloat(from.x.toFixed(2))
        from.y = parseFloat(from.y.toFixed(2))
        to.x = parseFloat(to.x.toFixed(2))
        to.y = parseFloat(to.y.toFixed(2))
        const distance = Math.sqrt(Math.pow(from.x - to.x, 2) + Math.pow(from.y - to.y, 2))        
        let rotateDeg = ((Math.atan((to.y - from.y) / (to.x - from.x))) * 180 / Math.PI);
        if(!rotateDeg) {
            $.Msg(from.x,'========', from.y,'=========', to.x,'===========', to.y)
        }
        if(rotateDeg < 0) {
            rotateDeg = 180 + rotateDeg
        } 

        this.lineParam = {
            length: distance, 
            rotateDeg: rotateDeg, 
            color: color || '#e0c060', 
            lineWidth: lineWidth || '3', 
            position: `${from.x}px ${from.y}px 0`
        }
    }
    render() {
        if(!this.lineParam.rotateDeg) {
            this.calcLineParam()
            return null
        }
        
        return <Panel id={this.props.id} style={{
            transform: `rotateZ( ${this.lineParam.rotateDeg}deg ) rotateX(0deg) rotateY(0deg) translate3d( ${this.lineParam.position.split(' ')[0]}, ${this.lineParam.position.split(' ')[1]}, 0px )`,
            position: '0 0 0',
            width: `${this.lineParam.length}px`, 
            height: `${this.lineParam.lineWidth}px`, 
            backgroundColor: `${this.lineParam.color}`,
            transformOrigin: '0 50%'
            }}>   
        </Panel>


    }
}


