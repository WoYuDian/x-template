import { BaseItem, registerAbility } from "../../../lib/dota_ts_adapter"
import { learnAbility } from "../../../game_logic/ability_manager"

@registerAbility()
export class item_piece_sheng_ming_zhuo_shao extends BaseItem
{
    bookName: string = 'fentianjue'
    abilityName: string = 'sheng_ming_zhuo_shao'
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