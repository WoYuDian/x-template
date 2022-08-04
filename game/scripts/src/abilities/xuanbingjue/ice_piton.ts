import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_force_of_water } from "../../modifiers/realm/modifier_force_of_water"
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

            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_explosion.vpcf", ParticleAttachment.POINT, caster )
            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, vPos, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 2, null, ParticleAttachment.POINT, null, vPos, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            
            Timers.CreateTimer(0.4, (function() {
                const radius = this.GetSpecialValueFor('aoe_radius');
                const caster = this.GetCaster();
                const enemies = FindUnitsInRadius(
                    caster.GetTeamNumber(), 
                    vPos, 
                    null, 
                    radius, 
                    UnitTargetTeam.ENEMY, 
                    UnitTargetType.BASIC + UnitTargetType.HERO, 
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,
                    false)
    
                    
                const basicDamage = this.GetSpecialValueFor('basic_damage')
                let stateExtraDamage = 0;
                const forceOfWaterMod = caster.FindModifierByName(modifier_force_of_water.name);
                if(caster.IsHero() && forceOfWaterMod) {
                    stateExtraDamage = this.GetSpecialValueFor('primary_state_factor') * forceOfWaterMod.GetStackCount()
                }

                for(const enemy of enemies) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: caster,
                        damage: stateExtraDamage + basicDamage,
                        damage_type: DamageTypes.MAGICAL,
                        damage_flags: DamageFlag.NONE,
                        ability: this
                    })
                }
            }).bind(this))
            // ProjectileManager.CreateLinearProjectile( {
            //     Ability: this,
            //     EffectName: 'particles/units/heroes/hero_crystalmaiden/maiden_freezing_field_explosion.vpcf',
            //     //@ts-ignore
            //     vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
            //     fDistance		: 2000,
            //     fStartRadius	: 50,
            //     fEndRadius		: 50,
            //     Source			: caster,
            //     bHasFrontalCone	: false,
            //     bReplaceExisting: false,
            //     iUnitTargetTeam	: UnitTargetTeam.ENEMY,
            //     iUnitTargetFlags: UnitTargetFlags.NONE,
            //     iUnitTargetType	: UnitTargetType.HERO + UnitTargetType.CREEP + UnitTargetType.BASIC,
            //     bDeleteOnHit    : true,
            //     fExpireTime     : GameRules.GetGameTime() + 10.0,
            //     //@ts-ignore
            //     vVelocity		: vDirection * 3000,
            //     bProvidesVision	: true,
            //     iVisionRadius	: 200	,
            //     iVisionTeamNumber: caster.GetTeamNumber()
            // } )
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('aoe_radius')
    }

    IsHidden(): boolean {
        return false
    }
}