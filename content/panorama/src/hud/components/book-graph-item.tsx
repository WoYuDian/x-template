import React, { Children, EventHandler } from 'react';
import { ForceOfRule } from '../common_type';
const colorMap = {
    metal: '#d6dbe1',
    wood: '#c7f132',
    water: '#32b5f1',
    fire: '#eb4500',
    rock: '#d5b84d',
    body: '#fb8a0e',
    spirit: '#00f5b9',
}

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
        

        let backgroundColor = '#33333300';

        // if(this.props.state.learned) {
        //     backgroundColor = '#33333300'
        // } else {
        //     backgroundColor = '#33333300'
        // }



        const width = this.props.book.force_of_rules.length * 20
        const margin = (100 - width) / 2
        const tagWidth = 100 / this.props.book.force_of_rules.length

        const forceOfRules = [] 
        for(const forceOfRule of this.props.book.force_of_rules) {
            forceOfRules.push(<Label localizedText={`#tag_${forceOfRule}`} style={{fontWeight: 'black' ,borderRadius: '8px', textAlign: 'center', width: `${tagWidth}%`, padding: '2.5px 0', height: '25px', backgroundColor: colorMap[forceOfRule as ForceOfRule], fontSize: '20px', color: 'black'}}></Label>)
        }

        const border = this.props.selected? '3px solid #e0c060': '1px solid #ffffff'
        return <Panel id={this.props.id} onactivate={this.selectBook} style={{padding: '10px 0 0 0', border: border ,borderRadius: '10px', height: `width-percentage(${this.props.styleConf.height}%)`, width: `${this.props.styleConf.width}%`, position: `${this.props.book.position.x}% ${this.props.book.position.y}px 0`, flowChildren: 'down'}}>
            {/* <Panel style={{width: '100%', height: '100%', backgroundColor: backgroundColor, zIndex: 1}}>
            </Panel> */}
            <Label style={{color: 'white', width: '100%', fontSize: '20px', textAlign: 'center'}} localizedText={`#DOTA_Tooltip_Ability_item_book_${this.props.book.book_name}`}></Label>
            <DOTAItemImage style={{borderRadius: '10px', padding: '5%', height: `width-percentage(72.7%)`, width: `60%`, margin: '10px 20%', zIndex: 0}} showtooltip={true} itemname={this.props.book.texture_src}></DOTAItemImage>
            <Panel style={{width: '90%', margin: '0 5%', height: '30px', textAlign: 'center'}}>
                <Panel style={{width: `${width}%`, margin: `0 ${margin}%`, height: '100%', flowChildren: 'right'}}>
                    {forceOfRules}
                </Panel>
            </Panel>
            
        </Panel>
        
    }

    selectBook(e: any) {
        this.props.selectBook(this.props.book.book_name);
    }
}