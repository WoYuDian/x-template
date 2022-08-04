import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_yun_ling_zhi_jing } from "../../modifiers/xilingji/yun_ling_zhi_jing"

@registerAbility()
export class yun_ling_zhi_jing extends BaseAbility
{
    OnToggle(): void {
        if(!IsServer()) return;

        if(this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, modifier_yun_ling_zhi_jing.name, {})
        } else {
            this.GetCaster().RemoveModifierByName(modifier_yun_ling_zhi_jing.name)
        }
    }
}
