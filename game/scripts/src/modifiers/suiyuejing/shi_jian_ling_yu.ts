
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_shi_jian_ling_yu_debuff } from "./shi_jian_ling_yu_debuff";
@registerModifier()
export class modifier_shi_jian_ling_yu extends BaseModifier {    
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        //particles/units/heroes/hero_faceless_void/faceless_void_chronosphere.vpcf
        const particle = ParticleManager.CreateParticle( "particles/shi_jian_ling_yu/shi_jian_ling_yu.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( particle, 0, parent, ParticleAttachment.ABSORIGIN_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )
        const radius = this.GetAbility().GetSpecialValueFor('radius')
        ParticleManager.SetParticleControl(particle, 1, Vector(radius, radius, radius))
        //@ts-ignore
        this.AddParticle(particle, false, false, -1, false, false)
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('radius');
    }

    GetModifierAura(): string {
        return modifier_shi_jian_ling_yu_debuff.name
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_ABSOLUTE, ModifierFunction.CASTTIME_PERCENTAGE, ModifierFunction.PROJECTILE_SPEED_BONUS]
    }

    GetModifierMoveSpeed_Absolute(): number {
        return this.GetAbility().GetSpecialValueFor('move_speed')
    }

    GetModifierPercentageCasttime(event: ModifierAbilityEvent): number {
        return this.GetAbility().GetSpecialValueFor('cast_time_percentage')
    }

    GetModifierProjectileSpeedBonus(): number {
        return this.GetAbility().GetSpecialValueFor('projectile_speed')
    }
}