import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { modifier_move } from "../../modifiers/common/modifier_move";
import { modifier_hit_watch } from "../../modifiers/common/modifier_hit_watch";
import { modifier_jin_gang_hou } from "../../modifiers/jingangjue/jin_gang_hou";
@registerAbility()
export class jin_gang_hou extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster()
            
        const buff = caster.FindModifierByName(modifier_luo_han_quan.name)
        const buffCost = this.GetSpecialValueFor('buff_cost')
        if(!buff ||(buff.GetStackCount() < buffCost)) return;        

        const forwardDirection = caster.GetForwardVector().Normalized();    
        const startRadius = this.GetSpecialValueFor('start_radius')
        const endRadius = this.GetSpecialValueFor('end_radius')
        const range = this.GetSpecialValueFor('range')

        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_beastmaster/beastmaster_primal_roar.vpcf", ParticleAttachment.POINT, caster )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, caster.GetAbsOrigin(), true )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, caster.GetAbsOrigin() + (forwardDirection * range), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        const projectile = ProjectileManager.CreateLinearProjectile({
            Ability : this,
            EffectName : "particles/di_dong_shu/di_dong_shu.vpcf",
            vSpawnOrigin : caster.GetAbsOrigin(),
            fDistance : range,
            fStartRadius : startRadius,
            fEndRadius : endRadius,
            Source : caster,
            bHasFrontalCone : true,
            bReplaceExisting : false,
            iUnitTargetTeam : UnitTargetTeam.ENEMY,
            iUnitTargetFlags : UnitTargetFlags.NONE,
            iUnitTargetType : UnitTargetType.HERO | UnitTargetType.BASIC,
            fExpireTime : GameRules.GetGameTime() + 10.0,
            bDeleteOnHit : true,
            //@ts-ignore
            vVelocity : forwardDirection * 2000,
            bProvidesVision : true,
            iVisionRadius : 200,
            iVisionTeamNumber : caster.GetTeamNumber()
        })

        buff.SetStackCount(buff.GetStackCount() - buffCost)

    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(!IsServer()) return;
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {            
            const caster = this.GetCaster()
            //@ts-ignore
            const direction = (target.GetAbsOrigin() - caster.GetAbsOrigin()).Normalized()
            const distance = this.GetSpecialValueFor('distance')
            const speed = this.GetSpecialValueFor('speed')
            const damage = this.GetSpecialValueFor('damage_factor') * (getForceOfRuleLevel('body', caster) + getForceOfRuleLevel('metal', caster))
            const duration = distance / speed
            target.AddNewModifier(caster, this, modifier_move.name, {
                duration: duration, 
                direction_x: direction.x,
                direction_y: direction.y,
                direction_z: direction.z,
                speed: speed
            })
    
            target.AddNewModifier(caster, this, modifier_hit_watch.name, {
                duration: duration,
                modifier_duration: this.GetSpecialValueFor('stun_factor') * getForceOfRuleLevel('body', caster), 
                hit_modifier: modifier_jin_gang_hou.name
            })

            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })
        }
    }

    IsHidden(): boolean {
        return false
    }
} 