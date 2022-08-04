import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_shield } from "../../modifiers/swordmanship/sword_shield"

@registerAbility()
export class sword_shield extends BaseAbility
{
    OnSpellStart(): void {                
        if(!IsServer()) return;
    }

    OnToggle(): void {
        if(!IsServer()) return;

        if(this.GetToggleState()) {
            this.GetCaster().AddNewModifier(this.GetCaster(), this, modifier_sword_shield.name, {})
        } else {
            this.GetCaster().RemoveModifierByName(modifier_sword_shield.name)
        }
    }
}