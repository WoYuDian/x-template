import { BaseItem, registerAbility } from "../lib/dota_ts_adapter"
import { learnBook } from "../game_logic/ability_manager"

@registerAbility()
export class item_book_ice_magic extends BaseItem
{
    bookName: string = 'ice_magic'
    OnSpellStart(): void {
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC()) {
            const playerId = owner.GetPlayerOwnerID()
            const result = learnBook(this.bookName, playerId)
            if(result) {
                print('heeeeeeeeeeeeeeeee+++++++++++++++++')
                this.SpendCharge()                
            }
        }
    }
}