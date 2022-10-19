import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { rotateVector } from "../../util";
@registerAbility()
export class xu_mi_zhi extends BaseAbility
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

            const luohanquanBuff = caster.FindModifierByName(modifier_luo_han_quan.name)

            if(!luohanquanBuff || (luohanquanBuff.GetStackCount() < this.GetSpecialValueFor('buff_cost'))) return;
            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetAbsOrigin()).Normalized()
            const stackCount = luohanquanBuff.GetStackCount()
            const angleRange = this.GetSpecialValueFor('angle_range')
            const anglePerFinger = angleRange / (stackCount + 1)
            const forwardDirection = caster.GetForwardVector().Normalized();                    
            
            let curDirection = rotateVector(forwardDirection, -(angleRange / 2))
            for(let i = 0; i < luohanquanBuff.GetStackCount(); i++) {
                curDirection = rotateVector(curDirection, anglePerFinger)

                ProjectileManager.CreateLinearProjectile( {
                    Ability: this,
                    EffectName: 'particles/xu_mi_zhi/xu_mi_zhi.vpcf',
                    vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
                    fDistance		: this.GetSpecialValueFor('distance'),
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
                    vVelocity		: curDirection * this.GetSpecialValueFor('speed'),
                    bProvidesVision	: true,
                    iVisionRadius	: 200	,
                    iVisionTeamNumber: caster.GetTeamNumber()
                } )
            }

            luohanquanBuff.SetStackCount(0)
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            const damage = this.GetSpecialValueFor('damage_factor') * (getForceOfRuleLevel('metal', caster) + getForceOfRuleLevel('body', caster));

            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            return false;
        }
    }

    IsHidden(): boolean {
        return false
    }
} 