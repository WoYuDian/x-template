import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_hui_chun_shu } from "../../modifiers/xilingji/hui_chun_shu"

@registerAbility()
export class hui_chun_shu extends BaseAbility
{
    OnToggle(): void {
        if(!IsServer()) return;

        if(this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, modifier_hui_chun_shu.name, {})
        } else {
            this.GetCaster().RemoveModifierByName(modifier_hui_chun_shu.name)
        }
    }
}
