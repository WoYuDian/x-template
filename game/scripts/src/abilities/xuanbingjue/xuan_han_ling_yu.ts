import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_xuan_han_ling_yu } from "../../modifiers/xuanbingjue/xuan_han_ling_yu"

@registerAbility()
export class xuan_han_ling_yu extends BaseAbility
{
    OnToggle(): void {
        if(!IsServer()) return;

        if(this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, modifier_xuan_han_ling_yu.name, {})
        } else {
            this.GetCaster().RemoveModifierByName(modifier_xuan_han_ling_yu.name)
        }
    }
}
