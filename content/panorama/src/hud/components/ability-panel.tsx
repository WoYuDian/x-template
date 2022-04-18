import React, { Children, EventHandler } from 'react';
import {AbilityGraphItem} from './ability-graph-item'
import {BookGraphItem} from './book-graph-item'
import {Line} from './line'
import { CustomTableType } from '../common_type'

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
    constructor(props: props) {
        super(props)
        this.togglePanel = this.togglePanel.bind(this)
        this.bookLevelIndexTable = {};
        this.bookLinks = [];
        this.uiStyleConfiguration = {
            book: {width: 12, height: 100, levelGapHeight: 50},
            ability: {width: 5, height: 100, levelGapHeight: 50}
        }
        this.state = {
            selectedBook: null
        }
        this.processBookGraph();
        this.selectBook = this.selectBook.bind(this)    
    }    

    render() {
        const bookItems = []
        const bookLines = []
        for(const bookName in this.props.bookMap) {
            this.calcBookPosition(this.props.bookMap[bookName], this.bookLevelIndexTable[this.props.bookMap[bookName].level])
            bookItems.push(<BookGraphItem selected={this.state.selectedBook == bookName} selectBook={this.selectBook} id={bookName} key={bookName} styleConf={this.uiStyleConfiguration.book} book={this.props.bookMap[bookName]}></BookGraphItem>)
        }

        for(const link of this.bookLinks) {
            const line = this.calcLinePosition(link)

            if(line) {
                bookLines.push(<Line key={`${link.from}-${link.to}`} line={line}></Line>)
            }
        }

        const abilityItems = []
        const abilityLines = []
        if(this.state.selectedBook) {
            const book = this.props.bookMap[this.state.selectedBook];
            for(const abilityName of book.abilityKeys) {
                this.calcAbilityPosition(this.props.abilityMap[abilityName], book.abilityLevelIndexTable[this.props.abilityMap[abilityName].level])
                abilityItems.push(<AbilityGraphItem id={abilityName} key={abilityName} styleConf={this.uiStyleConfiguration.ability} ability={this.props.abilityMap[abilityName]}></AbilityGraphItem>)
            }
            
            for(const link of book.abilityLinks) {
                const line = this.calcLinePosition(link)

                if(line) {
                    abilityLines.push(<Line key={`${link.from}-${link.to}`} line={line}></Line>)
                }
            }
        }
        
        //@ts-ignore
        if(this.props.showAbilityPanel) {
             return <Panel onactivate={this.togglePanel} style={{width: '100%', height: '100%'}}>
                <Panel onactivate={e => {}} id='ability_panel' style={{width: '95%', height: '95%', position: '2.5% 2.5% 0', backgroundColor: '#333333', borderRadius: '20px'}}>
                    <Label onactivate={this.togglePanel} style={{position: '93% 2% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '5px', fontSize: '20px'}} localizedText='#close_ability_panel'></Label>
                    <Panel style={{position: '0 0 0', width: '30%', height: '100%'}}>
                        <Panel style={{margin: '100px 20px 50px 20px', width: '100%', height: '100%', borderRight: '1px solid #ffffff'}}>
                            <Label style={{width: '100%', height: '50px', lineHeight: '40px', fontSize: '30px', color: '#ffffff', textAlign: 'center'}} localizedText='#book_graph'></Label>
                            <Panel style={{padding: '0 0 20px 0', position: '0 6% 0', width: '100%', height: '92%', //@ts-ignore
                                overflow: 'squish scroll'}}>
                                {bookItems}
                                {bookLines}
                            </Panel>
                        </Panel>

                    </Panel>
                    <Panel style={{position: '30% 0 0', width: '70%', height: '100%'}}>
                        <Panel style={{position: '20px 95% 0', flowChildren: 'right'}}>
                            <Label style={{fontSize: '20px', color: '#ffffff'}} localizedText='#ability_points'></Label>
                            <Label style={{fontSize: '20px', color: '#ffffff'}} text={this.props.playerAbilityInfo?.ability_points[this.props.playerId.toString()] || 0}></Label>
                        </Panel>                        
                        <Panel style={{margin: '100px 20px 50px 20px', width: '100%', height: '100%'}}>
                            <Label style={{width: '100%', height: '50px', lineHeight: '40px', fontSize: '30px', color: '#ffffff', textAlign: 'center'}} localizedText='#ability_graph'></Label>
                            <Panel style={{padding: '0 0 20px 0', position: '0 6% 0', width: '100%', height: '92%', //@ts-ignore
                                overflow: 'squish scroll'}}>
                                {abilityItems}
                                {abilityLines}
                            </Panel>
                        </Panel>
                    </Panel>
                </Panel>
            </Panel>
        } else {
            return <Label onactivate={this.togglePanel} style={{position: '318px 95% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#ability_panel'></Label>
        }
    }

    calcLinePosition(link: any) {
        const from = $(`#${link.from}`);
        const to = $(`#${link.to}`);
        if(from && to) {
            return {
                from: {x: (from.actualxoffset + from.contentwidth / 2) * 1.2, y: (from.actualyoffset + from.contentheight) * 1.2 + 8},
                to: {x: (to.actualxoffset + to.contentwidth / 2) * 1.2, y: (to.actualyoffset) * 1.2 - 8},
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
            x: (100 / (levelNum + 1)) * (ability.index + 1) - this.uiStyleConfiguration.ability.width / 2,
            y: ability.level * (this.uiStyleConfiguration.ability.height + this.uiStyleConfiguration.ability.levelGapHeight)
        }
    }

    calcBookPosition(book: any, levelNum: number) {
        book.position = {
            x: (100 / (levelNum + 1)) * (book.index + 1) - this.uiStyleConfiguration.book.width / 2,
            y: book.level * (this.uiStyleConfiguration.book.height + this.uiStyleConfiguration.book.levelGapHeight)
        }
    }
}

