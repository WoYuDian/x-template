import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_force_of_water } from "../../modifiers/realm/modifier_force_of_water"
@registerAbility()
export class ice_gland extends BaseAbility
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
            
            const curPos = caster.GetAbsOrigin() + (vDirection * 100)
            const radius = this.GetSpecialValueFor('radius');
            const stepDistance = radius / 3
            let curDistance = stepDistance;
            
            const distance = this.GetSpecialValueFor('distance')
            Timers.CreateTimer(0, (function() {
                const nFXIndex = ParticleManager.CreateParticle( "particles/ice_gland/ice_gland_burst.vpcf", ParticleAttachment.POINT, caster )

                //@ts-ignore
                ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, curPos, true )
                //@ts-ignore
                ParticleManager.SetParticleControlEnt( nFXIndex, 2, null, ParticleAttachment.POINT, null, curPos, true )
                ParticleManager.ReleaseParticleIndex( nFXIndex )
                
                const enemies = FindUnitsInRadius(
                    caster.GetTeamNumber(), 
                    //@ts-ignore
                    curPos, 
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

                if(curDistance < distance) {
                    curDistance += stepDistance;
                    //@ts-ignore
                    curPos = curPos + (100 * vDirection)
                    return 0.1
                }
            }).bind(this))
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('aoe_radius')
    }

    IsHidden(): boolean {
        return false
    }
}