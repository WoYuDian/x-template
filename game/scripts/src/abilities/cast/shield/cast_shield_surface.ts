import { getUnitFirstItem } from "../../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { Timers } from "../../../lib/timers";
import { cast_basic } from "../cast_basic";
import { modifier_shield_attributes } from "./shield_attributes";

@registerAbility()
export class cast_shield_surface extends cast_basic
{        
    OnSpellStart(): void {  
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const item = getUnitFirstItem(caster)

        if(!this.checkCondition()) return;

        item.item.SpendCharge()
        caster.RemoveAbilityByHandle(this)        

        let buff: modifier_shield_attributes;
        if(caster.HasModifier(modifier_shield_attributes.name)) {
            buff = caster.FindModifierByName(modifier_shield_attributes.name) as modifier_shield_attributes
        } else {
            buff = caster.AddNewModifier(caster, this, modifier_shield_attributes.name, {}) as modifier_shield_attributes
        }
        
        buff.updateAttributes({part: 'surface', item})
        
    }
}
