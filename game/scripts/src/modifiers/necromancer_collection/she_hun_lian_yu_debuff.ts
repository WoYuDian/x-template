
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_she_hun_lian_yu_debuff extends BaseModifier {
    damageFactor: number = 0
    damageInterval: number = 0
    healPercentage: number = 0
    parentBuff: CDOTA_Buff
    particle: ParticleID
    OnCreated(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.healPercentage = this.GetAbility().GetSpecialValueFor('heal_percentage')


        if(!IsServer()) return;
        const caster = this.GetCaster()
        const parent = this.GetParent()
        this.particle = ParticleManager.CreateParticle("particles/she_hun_lian_yu/she_hun_lian_yu.vpcf", ParticleAttachment.ABSORIGIN, caster)
        ParticleManager.SetParticleControlEnt( this.particle, 0, caster, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', caster.GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particle, 1, parent, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )

        this.parentBuff = this.GetCaster().FindModifierByName('modifier_she_hun_lian_yu')
        this.StartIntervalThink(this.damageInterval)
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particle, false)
		ParticleManager.ReleaseParticleIndex(this.particle)
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        if(!this.parentBuff) return;
        //@ts-ignore
        if(!this.parentBuff.succeed) return;
        const caster = this.GetCaster()
        const damage = this.damageFactor * (getForceOfRuleLevel('spirit', caster) + getForceOfRuleLevel('rock', caster))

        ApplyDamage({
            victim: this.GetParent(),
            attacker: caster,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })

        caster.Heal(damage * this.healPercentage / 100, this.GetAbility())
    }
}