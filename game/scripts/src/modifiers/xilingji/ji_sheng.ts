
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { ji_sheng_debuff } from "./ji_sheng_debuff";

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_ji_sheng extends BaseModifier {
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
        if(params.inflictor == this.GetAbility().GetCaster().FindAbilityByName('ji_sheng')) return

        if (params.damage_type == DamageTypes.MAGICAL) {
            const debuff = params.unit.FindModifierByName(ji_sheng_debuff.name)
            if(!debuff) {
                params.unit.AddNewModifier(params.attacker, this.GetAbility(), ji_sheng_debuff.name,
                    {duration: this.GetAbility().GetSpecialValueFor('duration_factor') * getForceOfRuleLevel('wood', params.attacker)})               
            } else {
                debuff.SetDuration(this.GetAbility().GetSpecialValueFor('duration_factor') * getForceOfRuleLevel('wood', params.attacker), true)
            }
        }
    }

    IsPurgable(): boolean {
        return false
    }
}