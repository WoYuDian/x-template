import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { calcDistanceOfTwoPoint } from "../../util";
import { modifier_di_ci } from "../../modifiers/banshanjue/di_ci";
@registerAbility()
export class di_ci extends BaseAbility
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


            Timers.CreateTimer(this.GetSpecialValueFor('delay'), (function() {      
                spawnRock(vPos, caster)  
                const radius = this.GetSpecialValueFor('radius')
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

                const damage = this.GetSpecialValueFor('damage_factor') * getForceOfRuleLevel('rock', caster);
                const knockbackDuration = this.GetSpecialValueFor('knockback_duration')
                for(const enemy of enemies) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: caster,
                        damage: damage,
                        damage_type: DamageTypes.MAGICAL,
                        damage_flags: DamageFlag.NONE,
                        ability: this
                    })

                    enemy.AddNewModifier(caster, this, 'modifier_knockback', {
                        center_x: vPos.x,
                        center_y: vPos.y,
                        center_z: vPos.z,
                        duration: knockbackDuration,
                        knockback_duration: knockbackDuration,
                        knockback_distance: radius - calcDistanceOfTwoPoint(vPos, enemy.GetAbsOrigin()),
                        knockback_height: 0,                        
                        should_stun: 0
                    })
                }
            }).bind(this))

    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }

    IsHidden(): boolean {
        return false
    }
}

export function spawnRock(position: Vector, caster: CDOTA_BaseNPC) {
    if(!caster.IsHero()) return;

    const ability = caster.FindAbilityByName(di_ci.name)
    if(!ability) return;

    const nFXIndex = ParticleManager.CreateParticle( "particles/di_ci/di_ci.vpcf", ParticleAttachment.POINT, caster )
    ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, position, true )
    ParticleManager.ReleaseParticleIndex( nFXIndex )

    
    Timers.CreateTimer(0.06, (function() {                        
        // const forceOfRuleLevel = getForceOfRuleLevel('wood', caster)

        const rock = CreateUnitByName('rock_big', 
            position, 
            false, 
            null, 
            PlayerResource.GetPlayer(caster.GetPlayerID()), 
            caster.GetTeamNumber()
        )    
    
        rock.AddNewModifier(
            caster, 
            ability, 
            modifier_di_ci.name, 
            {size: 3}
        )
    
        rock.SetMoveCapability(UnitMoveCapability.NONE)
        rock.SetControllableByPlayer(caster.GetPlayerOwnerID(), false); 
    }).bind(this))        
  
}