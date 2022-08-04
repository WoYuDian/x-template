import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_jin_gang_zhao } from "../../modifiers/jingangjue/jin_gang_zhao";
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerAbility()
export class jin_gang_zhao extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
       
        const caster = this.GetCaster()

        const luohanquanBuff = caster.FindModifierByName(modifier_luo_han_quan.name);
        if(!luohanquanBuff || (luohanquanBuff.GetStackCount() < this.GetSpecialValueFor('buff_cost'))) return;

        let buff = caster.FindModifierByName(modifier_jin_gang_zhao.name)

        if(!buff) {
            buff = caster.AddNewModifier(caster, this, modifier_jin_gang_zhao.name, {duration: this.GetSpecialValueFor('duration_factor') * getForceOfRuleLevel('metal', caster)})  
        } 

        
        buff.SetStackCount(luohanquanBuff.GetStackCount())
        luohanquanBuff.SetStackCount(0)        
    }

    IsHidden(): boolean {
        return false
    }
} 