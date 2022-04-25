import React, { Children, EventHandler } from 'react';

interface props {
    book: any
    styleConf: any
    selectBook: Function
    id: string,
    selected: boolean,
    state: any
}

export class BookGraphItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)

        this.selectBook = this.selectBook.bind(this)
    }

    render() {
        

        let backgroundColor;

        if(this.props.state.learned) {
            backgroundColor = '#33333300'
        } else {
            backgroundColor = '#33333399'
        }

        const border = this.props.selected? '3px solid #e0c060': null
        return <Panel id={this.props.id} onactivate={this.selectBook} style={{border: border ,borderRadius: '10px', height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`, position: `${this.props.book.position.x}% ${this.props.book.position.y}px 0`}}>
            <Panel style={{width: '100%', height: '100%', backgroundColor: backgroundColor, zIndex: 1}}>
            </Panel>
            <DOTAAbilityImage style={{borderRadius: '10px', padding: '5%', height: `90%`, width: `90%`, zIndex: 0}} abilityname={this.props.book.texture_src}></DOTAAbilityImage>            
        </Panel>
        
    }

    selectBook(e: any) {
        this.props.selectBook(this.props.book.book_name);
    }
}