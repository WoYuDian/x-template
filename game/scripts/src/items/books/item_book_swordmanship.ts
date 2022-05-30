import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { learnBook } from "../../game_logic/ability_manager"

@registerAbility()
export class item_book_swordmanship extends BaseItem
{
    bookName: string = 'swordmanship'
    OnSpellStart(): void {
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC()) {
            const playerId = owner.GetPlayerOwnerID()
            const result = learnBook(this.bookName, playerId)
            
            if(result) {
                this.SpendCharge()                
            }
        }
    }
}