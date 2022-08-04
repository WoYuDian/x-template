
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { han_qi_ru_hun_debuff } from "./han_qi_ru_hun_debuff";
import { han_qi_ru_hun_freezing } from "./han_qi_ru_hun_freezing";
import { modifier_force_of_water } from "../realm/modifier_force_of_water";
@registerModifier()
export class modifier_han_qi_ru_hun extends BaseModifier {
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
            const debuff = params.unit.FindModifierByName(han_qi_ru_hun_debuff.name)
            if(debuff) {
                if(debuff.GetStackCount() < (this.GetAbility().GetSpecialValueFor('max_stack_level'))) {
                    const buffForceOfWater = this.GetAbility().GetCaster().FindModifierByName(modifier_force_of_water.name)

                    let increment = 1;
                    if(buffForceOfWater) {
                        increment = buffForceOfWater.GetStackCount()
                    }

                    debuff.SetStackCount(debuff.GetStackCount() + increment)
                    debuff.SetDuration(this.GetAbility().GetSpecialValueFor('debuff_duration'), true)
                }                
                if((debuff.GetStackCount() >= this.GetAbility().GetSpecialValueFor('max_stack_level')) && !params.unit.FindModifierByName(han_qi_ru_hun_freezing.name)) {
                    params.unit.AddNewModifier(this.GetCaster(), this.GetAbility(), han_qi_ru_hun_freezing.name, {duration: this.GetAbility().GetSpecialValueFor('freezing_duration')})
                }
            } else {
                params.unit.AddNewModifier(params.attacker, this.GetAbility(), han_qi_ru_hun_debuff.name, {duration: this.GetAbility().GetSpecialValueFor('debuff_duration')})
            }
        }
    }

    IsPurgable(): boolean {
        return false
    }
}