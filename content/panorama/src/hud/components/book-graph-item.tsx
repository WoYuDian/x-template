import React, { Children, EventHandler } from 'react';

interface props {
    book: any
    styleConf: any
    selectBook: Function
    id: string
}

export class BookGraphItem extends React.Component<props, any> {
    constructor(props: props) {
        super(props)

        this.selectBook = this.selectBook.bind(this)
    }

    render() {
        return <DOTAAbilityImage id={this.props.id} onactivate={this.selectBook} style={{borderRadius: '10px', height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`, position: `${this.props.book.position.x}% ${this.props.book.position.y}px 0`}} abilityname={this.props.book.texture_src}></DOTAAbilityImage>
    }

    selectBook(e: any) {
        this.props.selectBook(this.props.book.book_name);
    }
}