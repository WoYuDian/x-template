
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_shi_du_debuff } from "./shi_du_debuff"; 

@registerModifier()
export class modifier_shi_du extends BaseModifier {
    OnCreated(params: object): void { 
    }

    OnRefresh(params: object): void {
        
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;      
        const parent = this.GetParent()  
        if(event.attacker != parent) return;
        if(event.unit == parent) return;
        if(event.unit.IsBuilding()) return;

        const ability = this.GetAbility()
        if(event.inflictor == ability) return;
        
        const duration = ability.GetSpecialValueFor('duration_factor') * (getForceOfRuleLevel('rock', parent) + getForceOfRuleLevel('spirit', parent))
        const debuff = event.unit.FindModifierByName(modifier_shi_du_debuff.name)
        if(debuff) {
            debuff.SetDuration(duration, true)
        } else {
            event.unit.AddNewModifier(parent, this.GetAbility(), modifier_shi_du_debuff.name, {
                duration: duration
            })
        }        
    }
}