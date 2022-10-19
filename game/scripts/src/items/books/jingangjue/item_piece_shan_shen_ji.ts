import { BaseItem, registerAbility } from "../../../lib/dota_ts_adapter"
import { learnAbility } from "../../../game_logic/ability_manager"

@registerAbility()
export class item_piece_shan_shen_ji extends BaseItem
{
    bookName: string = 'banshanjue'
    abilityName: string = 'shan_shen_ji'
    OnSpellStart(): void {
        const owner = this.GetOwner()
        
        if(owner.IsBaseNPC()) {
            const playerId = owner.GetPlayerOwnerID()
            const result = learnAbility(this.abilityName, this.bookName, playerId)
            
            if(result) {
                EmitSoundOn('Item.TomeOfKnowledge', owner)
                this.SpendCharge()                
            }
        }
    }
}