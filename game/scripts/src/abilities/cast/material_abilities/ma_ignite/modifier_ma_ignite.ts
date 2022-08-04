
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { modifier_ma_ignite_debuff } from "./modifier_ma_ignite_debuff";
@registerModifier()
export class modifier_ma_ignite extends BaseModifier {
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        const parent = this.GetParent()
        if(event.unit == parent) return;
        if(event.attacker != parent) return;       
        if(event.inflictor == this.GetAbility()) return;

        const duration = this.GetAbility().GetSpecialValueFor('duration_factor') * getFabaoSumOfForceOfRuleLevels(['fire'], parent)
        event.unit.AddNewModifier(parent, this.GetAbility(), modifier_ma_ignite_debuff.name, {duration})
    }
}
