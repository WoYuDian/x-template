
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
        if(!event.inflictor || event.inflictor.IsNull()) return;
        if(event.inflictor == this.GetAbility()) return;
        if(event.inflictor.GetName().indexOf('ma_') > -1) return;

        const duration = this.GetAbility().GetSpecialValueFor('duration_factor') * getFabaoSumOfForceOfRuleLevels(['fire'], parent)
        event.unit.AddNewModifier(parent, this.GetAbility(), modifier_ma_ignite_debuff.name, {duration})
    }

    GetEffectName(): string {
        return 'particles/econ/items/huskar/huskar_2021_immortal/huskar_2021_immortal_burning_spear_debuff_flame_circulate.vpcf'
    }

    IsHidden(): boolean {
        return true;
    }
}
