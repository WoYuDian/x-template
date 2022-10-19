
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ma_poison_debuff extends BaseModifier {
    maxStack: number
    damageFactor: number
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.damageFactor = getFabaoSumOfForceOfRuleLevels(['wood'], this.GetCaster()) * this.GetAbility().GetSpecialValueFor('damage_factor')
        this.maxStack = Math.ceil(getFabaoSumOfForceOfRuleLevels(['wood'], this.GetCaster()) * this.GetAbility().GetSpecialValueFor('stack_factor')) + this.GetAbility().GetSpecialValueFor('base_max_stack')
        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('damage_interval'))
    }   

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()
        this.IncrementStackCount()
        if(this.GetStackCount() > this.maxStack) {
            this.SetStackCount(this.maxStack)
        }

        const damage = this.damageFactor * this.GetStackCount()

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
        return 'particles/units/heroes/hero_venomancer/venomancer_gale_poison_debuff.vpcf'
    }

    IsDebuff(): boolean {
        return true
    }
}
