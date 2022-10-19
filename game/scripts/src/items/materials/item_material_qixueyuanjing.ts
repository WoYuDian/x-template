import { addForceOfRule } from "../../game_logic/realm_manager";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class item_material_qixueyuanjing extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return
        
        addForceOfRule({rule_name: 'body', bonus: this.GetSpecialValueFor('force_of_rule')}, this.GetCaster())
        this.SpendCharge()
    }
}