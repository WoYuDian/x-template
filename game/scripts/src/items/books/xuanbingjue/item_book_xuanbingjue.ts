import { BaseItem, registerAbility } from "../../../lib/dota_ts_adapter"
import { learnBook } from "../../../game_logic/ability_manager"

@registerAbility()
export class item_book_xuanbingjue extends BaseItem
{
    bookName: string = 'xuanbingjue'
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