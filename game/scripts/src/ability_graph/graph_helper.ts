const abilityBooks: any = {};
// import * as basic_ability from  './basic_ability.json'
// abilityBooks[basic_ability.book_name] = basic_ability;
import * as basic_magic from  './basic_magic.json'
abilityBooks[basic_magic.book_name] = basic_magic;
import * as basic_fitness from  './basic_fitness.json'
abilityBooks[basic_fitness.book_name] = basic_fitness;
import * as necromancer_collection from  './necromancer_collection.json'
abilityBooks[necromancer_collection.book_name] = necromancer_collection;
import * as swordmanship from  './swordmanship.json'
abilityBooks[swordmanship.book_name] = swordmanship;
import * as marksmanship from  './marksmanship.json'
abilityBooks[marksmanship.book_name] = marksmanship;
// import * as basic_witchcraft from  './basic_witchcraft.json'
// abilityBooks[basic_witchcraft.book_name] = basic_witchcraft;
// import * as ice_magic from  './ice_magic.json'
// abilityBooks[ice_magic.book_name] = ice_magic;
// import * as fire_magic from  './fire_magic.json'
// abilityBooks[fire_magic.book_name] = fire_magic;

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

export function getAbilityMap() {
    return abilityTable;
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

export function getPlayerAbilityState(playerAbilityPoints: number | undefined, playerAbilityMap: any, playerBookMap: any, abilityName: string) {
    playerAbilityMap = playerAbilityMap || {};
    playerBookMap = playerBookMap || {};
    playerAbilityPoints = playerAbilityPoints || 0;

    const ability = abilityTable[abilityName];

    const parentAbility = ability.parent_ability? abilityTable[ability.parent_ability] : null;

    let parentLearned = true;
    if(parentAbility) {
        parentLearned = (parseInt(playerAbilityMap[parentAbility.ability_name] || 0) > 0) && (parseInt(playerBookMap[parentAbility.book_name] || 0) > 0);
    }

    return {
        learnable: parentLearned && (parseInt(playerBookMap[ability.book_name] || 0) > 0) && (playerAbilityPoints > 0),
        level: parseInt(playerAbilityMap[abilityName] || 0)
    };
}

export function getPlayerBookState(playerBookMap: any, bookName: string) {
    playerBookMap = playerBookMap || {}

    const book = abilityBooks[bookName];

    const parentBooks = book.parents;

    let parentLearned = true;
    if(parentBooks) {
        for(const key in parentBooks) {
            if(!playerBookMap[key] || !(parseInt(playerBookMap[key] || 0) > 0)) {
                parentLearned = false;
                break;
            }
        }
    }

    return {
        learnable: parentLearned,
        learned: parseInt(playerBookMap[bookName] || 0) > 0
    }
}