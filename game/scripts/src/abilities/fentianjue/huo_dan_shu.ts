import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_force_of_water } from "../../modifiers/realm/modifier_force_of_water"
@registerAbility()
export class huo_dan_shu extends BaseAbility
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

            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetAbsOrigin()).Normalized()
            
            ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/huo_dan_shu/huo_dan_shu.vpcf',
                vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
                fDistance		: 2000,
                fStartRadius	: 50,
                fEndRadius		: 50,
                Source			: caster,
                bHasFrontalCone	: false,
                bReplaceExisting: false,
                iUnitTargetTeam	: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType	: UnitTargetType.ALL,
                bDeleteOnHit    : true,
                fExpireTime     : GameRules.GetGameTime() + 10.0,
                //@ts-ignore
                vVelocity		: vDirection * 2000,
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: caster.GetTeamNumber()
            } )
                        
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            const basicDamage = this.GetSpecialValueFor('basic_damage')
            let stateExtraDamage = 0;
            const forceOfWaterMod = caster.FindModifierByName(modifier_force_of_water.name);
            if(caster.IsHero() && forceOfWaterMod) {
                stateExtraDamage = this.GetSpecialValueFor('primary_state_factor') * forceOfWaterMod.GetStackCount()
            }                

            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: stateExtraDamage + basicDamage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const radius = this.GetSpecialValueFor('aoe_radius');

            const enemies = FindUnitsInRadius(
                caster.GetTeamNumber(), 
                location, 
                null, 
                radius, 
                UnitTargetTeam.ENEMY, 
                UnitTargetType.BASIC + UnitTargetType.HERO, 
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false)

            for(const enemy of enemies) {
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: (stateExtraDamage + basicDamage) * this.GetSpecialValueFor('aoe_damage_percentage'),
                    damage_type: DamageTypes.MAGICAL,
                    damage_flags: DamageFlag.NONE,
                    ability: this
                })
            }

            const origin = target.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_lina/lina_base_attack_explosion.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return true;
        }
    }

    IsHidden(): boolean {
        return false
    }
} 