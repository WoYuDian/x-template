
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { modifier_out_of_world } from "../../../modifiers/common/modifier_out_of_world";
import { calcDistanceOfTwoPoint } from "../../../util";
import { fabao_ability } from "../fabao_ability";
import { modifier_sword_attributes } from "./sword_attributes";

@registerAbility()
export class cast_sword_shot extends fabao_ability
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
            const vDirection = (vPos - this.GetCaster().GetOrigin()).Normalized()
            let distance = calcDistanceOfTwoPoint(vPos, caster.GetAbsOrigin())
            if(distance > 2000) {
                distance = 2000
                vPos = caster.GetAbsOrigin() + (2000 * vDirection)
            }

            const speed = caster.GetBaseMoveSpeed() * 5

            if(caster.HasModifier(modifier_out_of_world.name)) {
                caster.RemoveModifierByName(modifier_out_of_world.name)
            }
            caster.AddNewModifier(caster, this, modifier_out_of_world.name, {duration: distance / speed, dest_x: vPos.x, dest_y: vPos.y, dest_z: vPos.z})
            ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/sword_shot/sword_shot.vpcf',
                vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
                fDistance		: distance,
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
                vVelocity		: vDirection * speed,
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: speed,
                ExtraData: {}
            } )
    }

    IsHidden(): boolean {
        return false
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC, location: Vector, extraData: any): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            const buff = caster.FindModifierByName(modifier_sword_attributes.name) as modifier_sword_attributes;
            const damageFactor = buff? buff.damageFactor: 1
            const damage = this.GetSpecialValueFor('basic_damage') * damageFactor
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const origin = target.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodbath_eztzhok_burst.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return false;
        }
    }
}