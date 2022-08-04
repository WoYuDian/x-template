import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { BaseVectorAbility } from "../../lib/vector_targeting_interface";
import { Timers } from "../../lib/timers";
import { calcDistanceOfTwoPoint } from "../../util";
import { modifier_move } from "../../modifiers/common/modifier_move";
import { modifier_di_ci } from "../../modifiers/banshanjue/di_ci";

@registerAbility()
export class di_dong_shu extends BaseVectorAbility
{
    positionInit: Vector
    positionEnd: Vector
    firstCast: boolean = true
    prevTime: number = 0
    projectileMap: {[entityIndex: EntityIndex]: ProjectileID} = {}

    GetBehavior(): AbilityBehavior | Uint64 {
        return AbilityBehavior.POINT + AbilityBehavior.VECTOR_TARGETING + AbilityBehavior.AOE
    }    

    GetVectorTargetRange(): number {
        return this.GetSpecialValueFor('distance')
    }    

    GetVectorTargetStartRadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    GetVectorTargetEndRadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }

    OnVectorCastStart(vStartLocation: Vector, vDirection: Vector): void {
        const caster = this.GetCaster()

        const speed = this.GetSpecialValueFor('speed')
        const distance = this.GetSpecialValueFor('distance')
        const direction = this.GetVectorDirection()

        const nFXIndex = ParticleManager.CreateParticle( "particles/di_dong_shu/di_dong_shu_circle.vpcf", ParticleAttachment.POINT, this.GetCaster() ) 
                      
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, vStartLocation, true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        Timers.CreateTimer(this.GetSpecialValueFor('delay'), (function() {
            const alias = FindUnitsInRadius(
                caster.GetTeamNumber(), 
                vStartLocation, 
                null, 
                this.GetSpecialValueFor('radius'), 
                UnitTargetTeam.FRIENDLY, 
                UnitTargetType.BASIC, 
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false)
                
            for(const alia of alias) {
                if(alia.GetUnitName().indexOf('rock') > -1) {
                    const diCiBuff = alia.FindModifierByName(modifier_di_ci.name) as modifier_di_ci
                    const rockIndex = alia.GetEntityIndex()
                    const size = diCiBuff.size || 1;
                    const projectile = ProjectileManager.CreateLinearProjectile({
                        Ability : this,
                        EffectName : "particles/di_dong_shu/di_dong_shu.vpcf",
                        vSpawnOrigin : this.GetVectorPosition(),
                        fDistance : this.GetVectorTargetRange(),
                        fStartRadius : 64 * size,
                        fEndRadius : 64 * size,
                        Source : caster,
                        bHasFrontalCone : false,
                        bReplaceExisting : false,
                        iUnitTargetTeam : UnitTargetTeam.ENEMY,
                        iUnitTargetFlags : UnitTargetFlags.NONE,
                        iUnitTargetType : UnitTargetType.HERO | UnitTargetType.BASIC,
                        fExpireTime : GameRules.GetGameTime() + 10.0,
                        bDeleteOnHit : true,
                        //@ts-ignore
                        vVelocity : direction * speed,
                        bProvidesVision : true,
                        iVisionRadius : 200,
                        iVisionTeamNumber : caster.GetTeamNumber(),
                        ExtraData: {
                            size: size,
                            rockIndex: rockIndex,
                        }
                    })

                    this.projectileMap[rockIndex] = projectile
    
                    alia.AddNewModifier(caster, this, modifier_move.name, {
                        duration: distance / speed,
                        speed: speed,
                        direction_x: direction.x,
                        direction_y: direction.y,
                        direction_z: direction.z,
                        // effect: 'particles/econ/items/windrunner/windranger_arcana/windranger_arcana_ambient.vpcf'
                    })
                }
            }
        }).bind(this))



    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC, location: Vector, extraData: any): boolean | void {
        if(!IsServer()) return;
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const damage = this.GetSpecialValueFor('damage_factor') * 
                getForceOfRuleLevel('rock', this.GetCaster()) * 
                this.GetSpecialValueFor('base_size_factor') * 
                Math.pow(2, (extraData.size || 1) - 1)

            ApplyDamage({
                victim: target,
                attacker: this.GetCaster(),
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const rock = EntIndexToHScript(extraData.rockIndex);
            if(rock.IsBaseNPC()) {
                ApplyDamage({
                    victim: rock,
                    attacker: this.GetCaster(),
                    damage: damage,
                    damage_type: DamageTypes.PURE,
                    damage_flags: DamageFlag.NONE,
                    ability: this
                })

                if(!rock.IsAlive()) {
                    if(this.projectileMap[extraData.rockIndex] && ProjectileManager.IsValidProjectile(this.projectileMap[extraData.rockIndex])) {
                        ProjectileManager.DestroyLinearProjectile(this.projectileMap[extraData.rockIndex])
                        delete this.projectileMap[extraData.rockIndex]
                    }
                    
                }
            }
            
        }
    }
}