import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_force_of_water } from "../../modifiers/realm/modifier_force_of_water"
import { modifier_ice_piton } from "../../modifiers/xuanbingjue/modifier_ice_piton"
@registerAbility()
export class ice_piton extends BaseAbility
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
                EffectName: 'particles/creatures/aghanim/aghanim_crystal_attack.vpcf',
                //@ts-ignore
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
                vVelocity		: vDirection * 3000,
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
                enemy.AddNewModifier(caster, this, modifier_ice_piton.name, {duration: this.GetSpecialValueFor('slow_duration')})
            }

            const origin = target.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_lich/lich_frost_nova.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return true;
        }
    }
}