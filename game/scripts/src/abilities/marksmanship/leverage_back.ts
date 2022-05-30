import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_leverage_back } from "../../modifiers/marksmanship/leverage_back";

@registerAbility()
export class leverage_back extends BaseAbility
{    
    OnSpellStart(): void {                
        if(!IsServer()) return;
    }

    OnToggle(): void {
        if(!IsServer()) return;

        if(this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, modifier_leverage_back.name, {})
        } else {
            this.GetCaster().RemoveModifierByName(modifier_leverage_back.name)
        }
    }

    IsHidden(): boolean {
        return false
    }
}