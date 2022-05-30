import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"
@registerAbility()
export class sword_shot extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
            const owner = this.GetOwner()

            if(owner.IsBaseNPC() && owner.HasModifier(modifier_sword_mean_stacking.name)) {
                const swordMeanModifier = owner.FindModifierByName(modifier_sword_mean_stacking.name);

                //@ts-ignore
                swordMeanModifier.updateAbilityState()
                if(swordMeanModifier.GetStackCount() < this.GetSpecialValueFor('charge_cost')) {
                    return
                } else {
                    swordMeanModifier.SetStackCount(swordMeanModifier.GetStackCount() - this.GetSpecialValueFor('charge_cost'))
                    //@ts-ignore
                    swordMeanModifier.updateAbilityState()
                }                
            } else {
                return;
            }
            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }

            const caster = this.GetCaster();
            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetOrigin()).Normalized()

            ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/sword_linear_projectile.vpcf',
                vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
                fDistance		: 2000,
                fStartRadius	: 50,
                fEndRadius		: 50,
                Source			: caster,
                bHasFrontalCone	: false,
                bReplaceExisting: false,
                iUnitTargetTeam	: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType	: UnitTargetType.HERO + UnitTargetType.CREEP + UnitTargetType.BASIC,
                bDeleteOnHit    : true,
                fExpireTime     : GameRules.GetGameTime() + 10.0,
                //@ts-ignore
                vVelocity		: vDirection * 2000,
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: caster.GetTeamNumber()
            } )
    }

    IsHidden(): boolean {
        return false
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            const basicDamage = this.GetSpecialValueFor('basic_damage')
            let primaryStateDamage = 0;
            if(caster.IsHero()) {
                primaryStateDamage = this.GetSpecialValueFor('primary_state_factor') * caster.GetPrimaryStatValue()
            }                        
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: primaryStateDamage + basicDamage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const origin = target.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodbath_eztzhok_burst.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return true;
        }
    }
}