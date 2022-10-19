
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_lei_tin_zhen_ji_debuff } from "./lei_tin_zhen_ji_debuff";

@registerModifier()
export class modifier_lei_tin_zhen_ji extends BaseModifier {
    durationFactor: number = 0

    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.durationFactor = this.GetAbility().GetSpecialValueFor('duration_factor')
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;

        this.durationFactor = this.GetAbility().GetSpecialValueFor('duration_factor')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;    
        const parent = this.GetParent()
        if(event.attacker != parent) return;

        const ability = this.GetAbility()
        if(event.inflictor == ability) return;
        if(event.unit == parent) return;

        const duration = getForceOfRuleLevel('metal', parent) * this.durationFactor;
        event.unit.AddNewModifier(parent, ability, modifier_lei_tin_zhen_ji_debuff.name, {duration: duration})
    }

    IsHidden(): boolean {
        return true;
    }
}