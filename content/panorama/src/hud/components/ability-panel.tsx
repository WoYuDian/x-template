import React, { Children, EventHandler } from 'react';

interface props {
    bookRoot: any,
    bookMap: any,
    showAbilityPanel: boolean,
    setAbilityPanelVisible: Function
}

export class AbilityPanel extends React.Component<any, props> {
    bookLevelIndexTable: {[key: number]: number}
    processedBookList: any

    constructor(props: props) {
        super(props)
        this.togglePanel = this.togglePanel.bind(this)
    }

    render() {

        if(this.props.showAbilityPanel) {
             return <Panel onactivate={this.togglePanel} style={{width: '100%', height: '100%'}}>
                <Panel onactivate={e => {}} id='box' style={{width: '95%', height: '95%', position: '2.5% 2.5% 0', backgroundColor: '#333333', borderRadius: '20px'}}>
                    <Label onactivate={this.togglePanel} style={{position: '93% 2% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', color: '#ffffff', border: '1px solid #ffffff', borderRadius: '5px', fontSize: '20px'}} localizedText='#close_ability_panel'></Label>
                    <Panel style={{position: '0 0 0', width: '30%', height: '100%'}}></Panel>
                    <Panel style={{position: '30% 0 0', width: '70%', height: '100%'}}></Panel>
                </Panel>
            </Panel>
        } else {
            return <Label onactivate={this.togglePanel} style={{position: '318px 95% 0', textAlign: 'center', lineHeight: '30px', width: '100px', height: '40px', backgroundColor: '#333333', fontSize: '20px', color: '#ffffff', borderRadius: '5px'}} localizedText='#ability_panel'></Label>
        }
    }

    togglePanel() {
        this.props.setAbilityPanelVisible(!this.props.showAbilityPanel)
    }

    processBookGraph(book: any, level: number = 0) {
        if(book.level) {
            return;
        }

        book = book || this.props.bookRoot;
        book.level = level;

        if(!this.bookLevelIndexTable[book.level]) {
            this.bookLevelIndexTable[book.level] = 0;
        }

        book.index = this.bookLevelIndexTable[book.level]
        this.bookLevelIndexTable[book.level] += 1;

        if(book.children) {
            for(const key in book.children) {
                this.processBookGraph(book.Children[key], level + 1)
            }
        }

        book.abilityLevelIndexTable = {};
        book.abilityKeys = {};
        for(const key in book.ability_root) {
            this.processBookAbilityGraph(book.ability_root[key], 0, book)
        }
    }

    processBookAbilityGraph(ability: any, level: number, book: any) {
        if(ability.level || (ability.book_name != book.book_name)) {
            return;
        }

        ability.level = level;

        if(!book.abilityLevelIndexTable[ability.level]) {
            book.abilityLevelIndexTable[ability.level] = 0
        }

        ability.index = book.abilityLevelIndexTable[ability.level];
        book.abilityLevelIndexTable[ability.level] += 1;

        if(ability.children) {
            for(const key in ability.children) {
                this.processBookAbilityGraph(ability.children[key], level + 1, book)
            }
        }
    }
}

