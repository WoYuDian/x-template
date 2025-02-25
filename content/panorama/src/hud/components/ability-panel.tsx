import React, { Children, EventHandler } from 'react';
import {AbilityGraphItem} from './ability-graph-item'
import {BookGraphItem} from './book-graph-item'
import {Line} from './line'
import { CustomTableType } from '../common_type'
import {getPlayerAbilityState, getPlayerBookState} from '../../../../../game/scripts/src/ability_graph/graph_helper'

interface props {
    bookRoot: any,
    bookMap: any,
    abilityMap: any,
    showAbilityPanel: boolean,
    setAbilityPanelVisible: Function,
    playerId: PlayerID,
    playerAbilityInfo: CustomTableType<'player_ability_info', 'ability_info'> | null
}

interface state {
    selectedBook: string | null
}

export class AbilityPanel extends React.Component<props, state> {
    bookLevelIndexTable: {[key: number]: number}
    uiStyleConfiguration: any
    bookLinks: any[]
    availableAbilityPoints: number
    showAbilityTip: boolean = false
    constructor(props: props) {
        super(props)
        this.togglePanel = this.togglePanel.bind(this)
        this.bookLevelIndexTable = {};
        this.bookLinks = [];
        this.uiStyleConfiguration = {
            book: {width: 24, height: 130, levelGapHeight: 50, bookNumPerRow: 3},
            ability: {width: 5, height: 140, levelGapHeight: 50}
        }
        this.state = {
            selectedBook: null
        }
        this.processBookList();
        this.selectBook = this.selectBook.bind(this)    
        this.displayAbilityTip = this.displayAbilityTip.bind(this)
    }    

    render() {        
        const bookItems = []
        const bookLines = []
        const playerBookMap = this.props.playerAbilityInfo?.book_map[this.props.playerId.toString()]
        const playerAbilityMap = this.props.playerAbilityInfo?.ability_level_map[this.props.playerId.toString()]
        const playerAbilityPoints = this.props.playerAbilityInfo?.ability_points[this.props.playerId.toString()]

        for(const bookName in this.props.bookMap) {
            this.calcBookPosition(this.props.bookMap[bookName])
            bookItems.push(<BookGraphItem state={getPlayerBookState(playerBookMap, bookName)} selected={this.state.selectedBook == bookName} selectBook={this.selectBook} id={bookName} key={bookName} styleConf={this.uiStyleConfiguration.book} book={this.props.bookMap[bookName]}></BookGraphItem>)
        }

        for(const link of this.bookLinks) {
            const line = this.calcLinePosition(link)

            if(line) {
                bookLines.push(<Line id={`${link.from}-${link.to}`} key={`${link.from}-${link.to}`} line={line}></Line>)
            }
        }

        const abilityItems = []
        const abilityLines = []
        if(this.state.selectedBook) {
            const book = this.props.bookMap[this.state.selectedBook];
            for(const abilityName of book.abilityKeys) { 
                             
                this.calcAbilityPosition(this.props.abilityMap[abilityName], book.abilityLevelIndexTable[this.props.abilityMap[abilityName].level])
                abilityItems.push(<AbilityGraphItem state={getPlayerAbilityState(playerAbilityPoints ,playerAbilityMap, playerBookMap, abilityName)} id={abilityName} key={abilityName} styleConf={this.uiStyleConfiguration.ability} ability={this.props.abilityMap[abilityName]}></AbilityGraphItem>)
            }
            
            for(const link of book.abilityLinks) {
                const line = this.calcLinePosition(link)

                if(line) {
                    abilityLines.push(<Line id={`${link.from}-${link.to}`} key={`${link.from}-${link.to}`} line={line}></Line>)
                }
            }
        }

        //@ts-ignore
        if(this.props.showAbilityPanel) {
             return <Panel onactivate={this.togglePanel} style={{width: '100%', height: '100%', zIndex: 2}}>
                <Panel onactivate={e => {}} id='ability_panel' style={{width: '95%', height: '95%', position: '2.5% 2.5% 0', backgroundColor: '#333333', borderRadius: '20px'}}>
                    <Label onactivate={this.togglePanel} style={{position: '93% 2% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '5px', fontSize: '20px'}} localizedText='#close_ability_panel'></Label>                    
                    <Panel style={{position: '0 0 0', width: '30%', height: '100%'}}>
                        <Panel style={{margin: '100px 20px 50px 20px', width: '100%', height: '100%', borderRight: '1px solid #ffffff'}}>
                            <Label style={{width: '100%', height: '50px', lineHeight: '40px', fontSize: '30px', color: '#ffffff', textAlign: 'center'}} localizedText='#book_graph'></Label>
                            <Panel style={{padding: '0 0 20px 0', position: '0 6% 0', width: '100%', height: '92%', //@ts-ignore
                                overflow: 'squish scroll'}}>
                                <Panel style={{width: '100%'}}>
                                    {bookItems}
                                    {bookLines}
                                </Panel>  
                            </Panel>
                        </Panel>
                    </Panel>
                    <Panel style={{position: '30% 0 0', width: '70%', height: '100%'}}>
                        <Panel style={{position: '20px 95% 0', flowChildren: 'right'}}>
                            <Label style={{fontSize: '20px', color: '#ffffff'}} localizedText='#ability_points'></Label>
                            <Label style={{fontSize: '20px', color: '#ffffff'}} text={this.props.playerAbilityInfo?.ability_points[this.props.playerId.toString()] || 0}></Label>
                        </Panel>                        
                        <Panel style={{margin: '100px 20px 50px 20px', width: '100%', height: '100%'}}>
                            {this.showAbilityTip? 
                                <Label style={{transition: 'all 0.2s ease-in-out 0.2s', backgroundColor: '#333333', textAlign: 'center', margin: '0 20%', width: '60%', zIndex: 3, position: '0 50px 0', fontSize: '30px', color: 'white', border: '1px solid #ffffff', padding: '10px 10px', borderRadius: '10px'}} localizedText='#ability_note'></Label>
                                : null}
                            <Panel style={{margin: '0 25%', width: '50%', height: '50px', flowChildren: 'right'}}>
                                <Label style={{width: '48%', height: '50px', lineHeight: '30px', fontSize: '30px', padding: '10px 0', color: '#ffffff', textAlign: 'right'}} localizedText='#ability_graph'></Label>
                                <Label onmouseover={e => {this.displayAbilityTip(true)}} onmouseout={e => {this.displayAbilityTip(false)}} 
                                    style={{border: '1px solid #ffffff', color: 'white', borderRadius: '50%', height: '30px', width: 'height-percentage(100%)', fontSize: '20px', margin: '10px 0 10px 10px', padding: '5px 0', textAlign: 'center'}} text={'?'}></Label>
                            </Panel>                            
                            <Panel style={{padding: '0 0 20px 0', position: '0 6% 0', width: '100%', height: '92%', //@ts-ignore
                                overflow: 'squish scroll'}}>
                                <Panel style={{width: '100%'}}>
                                    {abilityItems}
                                    {abilityLines}
                                </Panel>    
                            </Panel>
                        </Panel>                        
                    </Panel>
                </Panel>
            </Panel>
        } else {
            return null
        }
    }

    displayAbilityTip(show: boolean) {
        this.showAbilityTip = show
    }

    calcLinePosition(link: any) {
        const from = $(`#${link.from}`);
        const to = $(`#${link.to}`);
        if(from && to) {
            const xScale = (1 / from.actualuiscale_x)
            const yScale = (1 / from.actualuiscale_y)
            return {
                from: {x: (from.actualxoffset + from.contentwidth / 2) * xScale, y: (from.actualyoffset + from.contentheight) * yScale + 8},
                to: {x: (to.actualxoffset + to.contentwidth / 2) * xScale, y: (to.actualyoffset) * yScale - 8},
            }
        } else {
            return null
        }
    }

    togglePanel() {
        this.props.setAbilityPanelVisible(!this.props.showAbilityPanel)
    }

    selectBook(bookName: string) {
        this.setState({selectedBook: bookName})
    }

    processBookList() {
        let index = 0
        for(const key in this.props.bookMap) {
            const book = this.props.bookMap[key];
            book.abilityLevelIndexTable = {};
            book.abilityKeys = [];
            book.abilityLinks = [];
            this.props.bookMap[key].index = index;
            index++;
            for(const ability in book.ability_root) {                
                this.processBookAbilityGraph(book.ability_root[ability], 0, book)                
            }            
        }
    }

    processBookGraph(book?: any, level: number = 0) {
        if(book && book.level) {
            return;
        }

        book = book || this.props.bookRoot;
        book.level = level;

        if(!this.bookLevelIndexTable[book.level]) {
            this.bookLevelIndexTable[book.level] = 0;
        }

        book.index = this.bookLevelIndexTable[book.level]
        this.bookLevelIndexTable[book.level] += 1;
        
        book.abilityLevelIndexTable = {};
        book.abilityKeys = [];
        book.abilityLinks = [];
        for(const key in book.ability_root) {
            this.processBookAbilityGraph(book.ability_root[key], 0, book)
        }
        
        if(book.children) {
            for(const key in book.children) {
                this.bookLinks.push({from: book.book_name, to: book.children[key].book_name})
                this.processBookGraph(book.children[key], level + 1)
            }
        }

    }

    processBookAbilityGraph(ability: any, level: number, book: any) {
        if(ability.level || (ability.book_name != book.book_name)) {
            return;
        }
        ability.level = level;
        book.abilityKeys.push(ability.ability_name)        
        if(!book.abilityLevelIndexTable[ability.level]) {
            book.abilityLevelIndexTable[ability.level] = 0
        }

        ability.index = book.abilityLevelIndexTable[ability.level];
        book.abilityLevelIndexTable[ability.level] += 1;

        if(ability.children) {
            for(const key in ability.children) {
                book.abilityLinks.push({from: ability.ability_name, to: ability.children[key].ability_name})
                this.processBookAbilityGraph(ability.children[key], level + 1, book)
            }
        }
    }

    calcAbilityPosition(ability: any, levelNum: number) {
        ability.position = {
            x: (ability.position_x || ((100 / (levelNum + 1)) * (ability.index + 1))) - this.uiStyleConfiguration.ability.width / 2,
            y: ability.level * (this.uiStyleConfiguration.ability.height + this.uiStyleConfiguration.ability.levelGapHeight)
        }
    }

    calcBookPosition(book: any) {
        //Graph version
        // book.position = {
        //     x: (book.position_x || ((100 / (levelNum + 1)) * (book.index + 1))) - this.uiStyleConfiguration.book.width / 2,
        //     y: book.level * (this.uiStyleConfiguration.book.height + this.uiStyleConfiguration.book.levelGapHeight)
        // }

        book.position = {
            x: ((book.index % 3) + 1) * (100 / (this.uiStyleConfiguration.book.bookNumPerRow + 1)) - this.uiStyleConfiguration.book.width / 2,
            y: Math.floor(book.index / 3)  * (this.uiStyleConfiguration.book.height + this.uiStyleConfiguration.book.levelGapHeight)
        }
    }
}

