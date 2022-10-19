import { getUnitFirstItem } from "../../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { Timers } from "../../../lib/timers";
import { cast_basic } from "../cast_basic";
import { modifier_banner_attributes } from "./banner_attributes";
@registerAbility()
export class cast_banner_flag extends cast_basic
{        
    OnSpellStart(): void {  
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const item = getUnitFirstItem(caster)

        if(!this.checkCondition()) return;

        item.item.SpendCharge()
        caster.RemoveAbilityByHandle(this)        

        let buff: modifier_banner_attributes;
        if(caster.HasModifier(modifier_banner_attributes.name)) {
            buff = caster.FindModifierByName(modifier_banner_attributes.name) as modifier_banner_attributes
        } else {
            buff = caster.AddNewModifier(caster, this, modifier_banner_attributes.name, {}) as modifier_banner_attributes
        }
        
        buff.updateAttributes({part: 'flag', item})
        
    }    
}
