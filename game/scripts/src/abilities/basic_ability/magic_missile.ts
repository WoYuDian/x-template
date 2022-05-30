import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
@registerAbility()
export class magic_missile extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }

            const caster = this.GetCaster();
            const vDirection = vPos - caster.GetOrigin()

            ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/skywrath_mage_concussive_shot_linear.vpcf',
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
                vVelocity		: vDirection * 2,
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
            const basicDamage = this.GetLevelSpecialValueFor('basic_damage', this.GetLevel() - 1)
            let intelligenceDamage = 0;
            if(caster.IsHero()) {
                intelligenceDamage = this.GetLevelSpecialValueFor('primary_state_factor', this.GetLevel() - 1) * caster.GetPrimaryStatValue()
            }                        
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: intelligenceDamage + basicDamage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const origin = target.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot_impact.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return true;
        }
    }
}