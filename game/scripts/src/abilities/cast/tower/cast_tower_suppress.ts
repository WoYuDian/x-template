
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { Timers } from "../../../lib/timers";
import { modifier_out_of_world } from "../../../modifiers/common/modifier_out_of_world";
import { calcDistanceOfTwoPoint } from "../../../util";
import { fabao_ability } from "../fabao_ability";
import { modifier_tower_attributes } from "./tower_attributes";
import { modifier_tower_suppress } from "./tower_suppress";
@registerAbility()
export class cast_tower_suppress extends fabao_ability
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }

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

            if(caster.HasModifier(modifier_out_of_world.name)) {
                caster.RemoveModifierByName(modifier_out_of_world.name)
            }            



            const buff = caster.FindModifierByName(modifier_tower_attributes.name) as modifier_tower_attributes;
            const delay = 0.5
            caster.AddNewModifier(caster, this, modifier_out_of_world.name, {duration: buff.duration + delay, dest_x: vPos.x, dest_y: vPos.y, dest_z: vPos.z})
            caster.SetAbsOrigin(vPos)

            const scale = buff.auraRadius / 260
            const particleId = ParticleManager.CreateParticle( "particles/cast_tower_suppress/cast_tower_suppress.vpcf", ParticleAttachment.WORLDORIGIN, null)
            ParticleManager.SetParticleControlEnt( particleId, 0, null, ParticleAttachment.WORLDORIGIN, null, vPos, true )
            ParticleManager.SetParticleControl( particleId, 4, Vector(scale, scale, scale))

            
            Timers.CreateTimer(delay, (function() {         
                
                const duration = buff.duration            
                CreateModifierThinker(caster, this, modifier_tower_suppress.name, {duration: duration, particle: particleId}, vPos, caster.GetTeamNumber(), false)

                const enemies = FindUnitsInRadius(
                    caster.GetTeamNumber(), 
                    vPos, 
                    null, 
                    buff.auraRadius, 
                    UnitTargetTeam.ENEMY, 
                    UnitTargetType.BASIC + UnitTargetType.HERO, 
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,
                    false)
                
                const damage = this.GetSpecialValueFor('basic_damage') * buff.damageFactor
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
            }).bind(this))                        
    }

    IsHidden(): boolean {
        return false
    }
}