
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class sheng_ming_zhuo_shao_debuff extends BaseModifier {
    primaryStateFactor: number = 0
    damageInterval: number = 0
    caster: CDOTA_BaseNPC
    ability: CDOTABaseAbility
    OnCreated(params: any): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
        this.ability = this.GetAbility()
        this.caster = this.ability.GetCaster()
        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.caster,
            damage: getForceOfRuleLevel('fire', this.caster) * this.primaryStateFactor,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.ability
        })
    }

    IsPurgable(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return true;
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_huskar/huskar_burning_spear_debuff.vpcf'
    }
}