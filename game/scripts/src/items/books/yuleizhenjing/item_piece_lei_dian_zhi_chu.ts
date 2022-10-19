import { BaseItem, registerAbility } from "../../../lib/dota_ts_adapter"
import { learnAbility } from "../../../game_logic/ability_manager"

@registerAbility()
export class item_piece_lei_dian_zhi_chu extends BaseItem
{
    bookName: string = 'yuleizhenjing'
    abilityName: string = 'lei_dian_zhi_chu'
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