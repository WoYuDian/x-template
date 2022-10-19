import { getUnitFirstItem } from "../../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { Timers } from "../../../lib/timers";
import { cast_basic } from "../cast_basic";
import { modifier_bow_attributes } from "./bow_attributes";
@registerAbility()
export class cast_bow_bowstring extends cast_basic
{        
    OnSpellStart(): void {  
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const item = getUnitFirstItem(caster)

        if(!this.checkCondition()) return;

        item.item.SpendCharge()
        caster.RemoveAbilityByHandle(this)        

        let buff: modifier_bow_attributes;
        if(caster.HasModifier(modifier_bow_attributes.name)) {
            buff = caster.FindModifierByName(modifier_bow_attributes.name) as modifier_bow_attributes
        } else {
            buff = caster.AddNewModifier(caster, this, modifier_bow_attributes.name, {}) as modifier_bow_attributes
        }
        
        buff.updateAttributes({part: 'bowstring', item})
        
    }    
}
