import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { learnBook } from "../../game_logic/ability_manager"

@registerAbility()
export class item_book_banshanjue extends BaseItem
{
    bookName: string = 'banshanjue'
    OnSpellStart(): void {
        const owner = this.GetOwner()
        
        if(owner.IsBaseNPC()) {
            const playerId = owner.GetPlayerOwnerID()
            const result = learnBook(this.bookName, playerId)
            
            if(result) {
                EmitSoundOn('Item.TomeOfKnowledge', owner)
                this.SpendCharge()                
            }
        }
    }
}