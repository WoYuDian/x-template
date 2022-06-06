
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { cold_touch_debuff } from "./cold_touch_debuff";
import { cold_touch_freezing } from "./cold_touch_freezing";
@registerModifier()
export class modifier_cold_touch extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }
    
    
    OnTakeDamage(params: ModifierInstanceEvent): number {
        if(!IsServer()) return;        
        if(params.attacker != this.GetParent()) return;
        if(params.unit == this.GetParent()) return;
        if(params.unit.IsBuilding()) return;

        if (params.damage_type == DamageTypes.MAGICAL) {
            const debuff = params.unit.FindModifierByName(cold_touch_debuff.name)
            if(debuff) {
                if(debuff.GetStackCount() < (this.GetAbility().GetSpecialValueFor('max_stack_level'))) {
                    debuff.IncrementStackCount()
                    debuff.SetDuration(this.GetAbility().GetSpecialValueFor('debuff_duration'), true)
                }                
                if((debuff.GetStackCount() >= this.GetAbility().GetSpecialValueFor('max_stack_level')) && !params.unit.FindModifierByName(cold_touch_freezing.name)) {
                    params.unit.AddNewModifier(this.GetCaster(), this.GetAbility(), cold_touch_freezing.name, {duration: this.GetAbility().GetSpecialValueFor('freezing_duration')})
                }
            } else {
                params.unit.AddNewModifier(params.attacker, this.GetAbility(), cold_touch_debuff.name, {duration: this.GetAbility().GetSpecialValueFor('debuff_duration')})
            }
        }
    }

    IsPurgable(): boolean {
        return false
    }
}