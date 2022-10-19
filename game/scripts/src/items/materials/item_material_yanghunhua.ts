import { addForceOfRule } from "../../game_logic/realm_manager";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class item_material_yanghunhua extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return
        
        addForceOfRule({rule_name: 'spirit', bonus: this.GetSpecialValueFor('force_of_rule')}, this.GetCaster())
        this.SpendCharge()
    }
}