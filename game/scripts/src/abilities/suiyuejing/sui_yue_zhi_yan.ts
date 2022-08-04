import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { calcDistanceOfTwoPoint } from "../../util";
import { modifier_sui_yue_zhi_yan } from "../../modifiers/suiyuejing/sui_yue_zhi_yan";
import { getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";

@registerAbility()
export class sui_yue_zhi_yan extends BaseAbility
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
            EffectName: 'particles/sui_yue_zhi_yan/sui_yue_zhi_yan.vpcf',
            vSpawnOrigin	: caster.GetAbsOrigin(),
            fDistance		: calcDistanceOfTwoPoint(vPos, caster.GetAbsOrigin()),
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
        if(target) return;

        const caster = this.GetCaster()
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            location, 
            null, 
            this.GetSpecialValueFor('radius'), 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        const duration = this.GetSpecialValueFor('duration_factor') * getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], caster)
        for(const enemy of enemies) {
            enemy.AddNewModifier(caster, this, modifier_sui_yue_zhi_yan.name, {duration: duration})
        }

        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_phoenix/phoenix_fire_spirit_ground.vpcf", ParticleAttachment.POINT, caster )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, location, true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

}