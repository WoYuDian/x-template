
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { fang_yu_zhuo_shao_debuff } from "./fang_yu_zhuo_shao_debuff";
@registerModifier()
export class modifier_fang_yu_zhuo_shao extends BaseModifier {
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
        if(params.inflictor == this.GetAbility().GetCaster().FindAbilityByName('sheng_ming_zhuo_shao')) return

        if (params.damage_type == DamageTypes.MAGICAL) {
            const debuff = params.unit.FindModifierByName(fang_yu_zhuo_shao_debuff.name)
            if(debuff) {
                if(debuff.GetStackCount() < (this.GetAbility().GetSpecialValueFor('max_stack_level'))) {
                    debuff.IncrementStackCount()
                    debuff.SetDuration(this.GetAbility().GetSpecialValueFor('debuff_duration'), true)
                }                
            } else {
                params.unit.AddNewModifier(params.attacker, this.GetAbility(), fang_yu_zhuo_shao_debuff.name, {duration: this.GetAbility().GetSpecialValueFor('debuff_duration')})
            }
         
        }
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true;
    }
}