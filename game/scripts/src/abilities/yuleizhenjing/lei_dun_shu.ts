import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";

import { modifier_move } from "../../modifiers/common/modifier_move";
import { calcDistanceOfTwoPoint } from "../../util";
@registerAbility()
export class lei_dun_shu extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }
            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetAbsOrigin()).Normalized()

            const caster = this.GetCaster();            

            const speed = this.GetSpecialValueFor('speed')
            let distance = calcDistanceOfTwoPoint(caster.GetAbsOrigin(), vPos)
            const maxDistance = this.GetSpecialValueFor('radius');
            if(distance > maxDistance) {
                distance = maxDistance
            }
            
            caster.AddNewModifier(caster, this, modifier_move.name, {
                speed: speed,
                direction_x: vDirection.x,
                direction_y: vDirection.y,
                direction_z: vDirection.z,
                effect: 'particles/units/heroes/hero_stormspirit/stormspirit_ball_lightning.vpcf',
                duration: distance / speed
            })

            const projectile = ProjectileManager.CreateLinearProjectile({
                Ability : this,
                EffectName : "particles/di_dong_shu/di_dong_shu.vpcf",
                vSpawnOrigin : caster.GetAbsOrigin(),
                fDistance : distance,
                fStartRadius : 128,
                fEndRadius : 128,
                Source : caster,
                bHasFrontalCone : false,
                bReplaceExisting : false,
                iUnitTargetTeam : UnitTargetTeam.ENEMY,
                iUnitTargetFlags : UnitTargetFlags.NONE,
                iUnitTargetType : UnitTargetType.HERO | UnitTargetType.BASIC,
                fExpireTime : GameRules.GetGameTime() + 10.0,
                bDeleteOnHit : true,
                //@ts-ignore
                vVelocity : vDirection * speed,
                bProvidesVision : true,
                iVisionRadius : 200,
                iVisionTeamNumber : caster.GetTeamNumber()
            })
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) { 
            const caster = this.GetCaster()
            const damage = this.GetSpecialValueFor('damage_factor') * (getForceOfRuleLevel('metal', caster) + getForceOfRuleLevel('fire', caster))
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })
        }

        return false
    }

    IsHidden(): boolean {
        return false
    }
}