import { BaseItem, registerAbility } from "../../../lib/dota_ts_adapter"
import { learnAbility } from "../../../game_logic/ability_manager"

@registerAbility()
export class item_piece_zhong_ling_shu extends BaseItem
{
    bookName: string = 'xilingji'
    abilityName: string = 'zhong_ling_shu'
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