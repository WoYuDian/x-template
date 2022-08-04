import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"
@registerAbility()
export class sword_rain extends BaseAbility
{    
    frameTime: number
    interval: number
    chargeCostPerSword: number
    travelDistance: number
    hitRadius: number
    shotRange: number
    stackModifier: CDOTA_Buff
    direction: Vector
    OnSpellStart(): void {                
        if(!IsServer()) return;

        this.frameTime = 0;
        this.interval = this.GetSpecialValueFor('interval')
        this.chargeCostPerSword = this.GetSpecialValueFor('charge_cost_per_sword')
        this.travelDistance = this.GetSpecialValueFor('travel_distance')
        this.hitRadius = this.GetSpecialValueFor('hit_radius')
        this.shotRange = this.GetSpecialValueFor('shot_range')

        const owner = this.GetOwner()
        if(owner.IsBaseNPC()) {
            this.stackModifier = owner.FindModifierByName(modifier_sword_mean_stacking.name)
        }

        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        //@ts-ignore
        this.direction = (vPos - this.GetCaster().GetOrigin()).Normalized()
        
    }

    OnChannelThink(interval: number): void {
        if(!this.stackModifier || !IsServer()) return;
        this.frameTime += FrameTime();

        if((this.frameTime > this.interval) && this.stackModifier && (this.stackModifier.GetStackCount() >= this.chargeCostPerSword)) {
            this.stackModifier.SetStackCount(this.stackModifier.GetStackCount() - this.chargeCostPerSword)
            this.frameTime = 0;

            const caster = this.GetCaster()
            const origin = caster.GetAbsOrigin() - (this.direction * 200) + RandomVector(this.shotRange)
            ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/sword_shot/sword_shot.vpcf',
                //@ts-ignore
                vSpawnOrigin	: origin,
                fDistance		: this.travelDistance,
                fStartRadius	: this.hitRadius,
                fEndRadius		: this.hitRadius,
                Source			: caster,
                bHasFrontalCone	: false,
                bReplaceExisting: false,
                iUnitTargetTeam	: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType	: UnitTargetType.HERO + UnitTargetType.CREEP + UnitTargetType.BASIC,
                bDeleteOnHit    : true,
                fExpireTime     : GameRules.GetGameTime() + 10.0,
                //@ts-ignore
                vVelocity		: this.direction * 1500,
                //@ts-ignore
                vAcceleration   : this.direction * 2000,
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: caster.GetTeamNumber()
            } )
        }
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            
            const damage = this.GetSpecialValueFor('damage_factor') * getForceOfRuleLevel('metal', caster)
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

            return true;
        }
    }

    IsHidden(): boolean {
        return false
    }
}