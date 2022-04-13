const abilityBooks: any = {};

import * as basic_abilities from  './basic_ability.json'
abilityBooks[basic_abilities.book_name] = basic_abilities;
import * as ice_magic from  './ice_magic.json'
abilityBooks[ice_magic.book_name] = ice_magic;

for(const bookName in abilityBooks) {
    abilityBooks[bookName].children = {}
    abilityBooks[bookName].parents = {}
    abilityBooks[bookName].ability_root = {}
}

const abilityTable: any = {};

export function loadAbilityGraph() {

    for(const bookName in abilityBooks) {
        const book = abilityBooks[bookName];
        for(const abilityKey in book.abilities) {
            const ability = book.abilities[abilityKey]
            ability.ability_name = abilityKey;
            ability.book_name = book.book_name;
            ability.children = {}
            // {ability_name: abilityKey, book_name: book.book_name , ...book.abilities[abilityKey], children: {}}
            abilityTable[abilityKey] = ability;
        }
    }

    for(const abilityKey in abilityTable) {
        const ability = abilityTable[abilityKey];
        if(ability.parent_ability) {
            if(abilityTable[ability.parent_ability]) {

                if(abilityTable[ability.parent_ability].book_name != ability.book_name) {
                    abilityBooks[abilityTable[ability.parent_ability].book_name].children[ability.book_name] = abilityBooks[ability.book_name];
                    abilityBooks[ability.book_name].parents[abilityTable[ability.parent_ability].book_name] = abilityBooks[abilityTable[ability.parent_ability].book_name]
                    abilityBooks[ability.book_name].ability_root[abilityKey] = ability;
                }
                abilityTable[ability.parent_ability].children[abilityKey] = ability;
            }
        } else {
            abilityBooks[ability.book_name].ability_root[abilityKey] = ability;
        }
    }
}

export function getBookMap() {
    return abilityBooks;
}

export function getBookRoot() {
    let curBook;
    for(const bookName in abilityBooks) {
        curBook = abilityBooks[bookName];
        break;
    }

    while(Object.keys(curBook.parents).length > 0) {
        curBook = curBook.parents[Object.keys(curBook.parents)[0]]
    }

    return curBook;
}