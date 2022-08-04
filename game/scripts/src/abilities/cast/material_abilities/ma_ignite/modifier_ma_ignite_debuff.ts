
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ma_ignite_debuff extends BaseModifier {
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('damage_interval'))
    }   

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const damage = getFabaoSumOfForceOfRuleLevels(['fire'], caster) * this.GetAbility().GetSpecialValueFor('damage_factor')

        ApplyDamage({
            victim: this.GetParent(),
            attacker: caster,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf'
    }

    IsDebuff(): boolean {
        return true
    }
}
