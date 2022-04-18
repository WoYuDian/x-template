import React, { Children, EventHandler } from 'react';

interface props {
    book: any
    styleConf: any
    selectBook: Function
    id: string,
    selected: boolean
}

export class BookGraphItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)

        this.selectBook = this.selectBook.bind(this)
    }

    render() {
        const border = this.props.selected? '3px solid #e0c060': null
        return <Panel id={this.props.id} onactivate={this.selectBook} style={{border: border ,borderRadius: '10px', height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`, position: `${this.props.book.position.x}% ${this.props.book.position.y}px 0`}}>
            <DOTAAbilityImage   style={{padding: '5%', height: `90%`, width: `90%`}} abilityname={this.props.book.texture_src}></DOTAAbilityImage>
        </Panel>
        
    }

    selectBook(e: any) {
        this.props.selectBook(this.props.book.book_name);
    }
}