import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
@registerAbility()
export class yu_lei_shu extends BaseAbility
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

            const nFXIndex = ParticleManager.CreateParticle( "particles/yu_lei_shu/yu_lei_shu.vpcf", ParticleAttachment.POINT, caster )

            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, vPos, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, vPos, true )
            // ParticleManager.SetParticleControlEnt( nFXIndex, 2, null, ParticleAttachment.POINT, null, vPos, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            
            
            const radius = this.GetSpecialValueFor('radius');
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

                
            const damage = (getForceOfRuleLevel('fire', caster) + getForceOfRuleLevel('metal', caster)) * this.GetSpecialValueFor('damage_factor');

            for(const enemy of enemies) {
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: DamageTypes.MAGICAL,
                    damage_flags: DamageFlag.NONE,
                    ability: this
                })
            }
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    IsHidden(): boolean {
        return false
    }
}