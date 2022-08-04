import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_jian_shi } from "../../modifiers/suiyuejing/shi_jian_jian_shi";

@registerAbility()
export class shi_jian_jian_shi extends BaseAbility
{
    OnSpellStart(): void {
        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        const caster = this.GetCaster();

        //@ts-ignore
        const vDirection = (vPos - caster.GetOrigin()).Normalized()

        ProjectileManager.CreateLinearProjectile( {
            Ability: this,
            EffectName: 'particles/econ/items/windrunner/windranger_arcana/windranger_arcana_spell_powershot_v2.vpcf',
            vSpawnOrigin	: caster.GetAbsOrigin(),
            fDistance		: this.GetSpecialValueFor('distance'),
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
            vVelocity		: vDirection * this.GetSpecialValueFor('speed'),
            bProvidesVision	: true,
            iVisionRadius	: 200	,
            iVisionTeamNumber: caster.GetTeamNumber()
        } )


    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            target.AddNewModifier(this.GetCaster(), this, modifier_shi_jian_jian_shi.name, {
                duration: this.GetSpecialValueFor('duration')
            })

        }
    }
}