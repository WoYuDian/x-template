import { getUnitFirstItem } from "../../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { Timers } from "../../../lib/timers";
import { cast_basic } from "../cast_basic";
import { modifier_sword_attributes } from "./sword_attributes";
@registerAbility()
export class cast_sword_blade extends cast_basic
{        
    OnSpellStart(): void {  
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const item = getUnitFirstItem(caster)

        if(!this.checkCondition()) return;

        item.item.SpendCharge()
        caster.RemoveAbilityByHandle(this)        

        let buff: modifier_sword_attributes;
        if(caster.HasModifier(modifier_sword_attributes.name)) {
            buff = caster.FindModifierByName(modifier_sword_attributes.name) as modifier_sword_attributes
        } else {
            buff = caster.AddNewModifier(caster, this, modifier_sword_attributes.name, {}) as modifier_sword_attributes
        }
        
        buff.updateAttributes({part: 'blade', item})
        
    }    
}
