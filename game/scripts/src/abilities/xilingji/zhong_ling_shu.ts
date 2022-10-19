import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_zhong_ling_shu } from "../../modifiers/xilingji/zhong_ling_shu";
@registerAbility()
export class zhong_ling_shu extends BaseAbility
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
            const casterPosition = caster.GetAbsOrigin()
            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetAbsOrigin()).Normalized()
            const castRange = this.GetSpecialValueFor('cast_range');
            let distance = Math.sqrt(Math.pow(vPos.x - casterPosition.x, 2) + Math.pow(vPos.y - casterPosition.y, 2))
            distance = distance > castRange? castRange: distance;            
            const delay = distance / 2000;

            const projectile = ProjectileManager.CreateLinearProjectile( {
                Ability: this,
                EffectName: 'particles/skywrath_mage_concussive_shot_linear.vpcf',
                vSpawnOrigin	: this.GetCaster().GetAbsOrigin(),
                fDistance		: distance + 2000,
                fStartRadius	: 50,
                fEndRadius		: 50,
                Source			: caster,
                bHasFrontalCone	: false,
                bReplaceExisting: false,
                iUnitTargetTeam	: UnitTargetTeam.ENEMY,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType	: UnitTargetType.ALL,
                bDeleteOnHit    : true,
                fExpireTime     : GameRules.GetGameTime() + delay + 5,
                //@ts-ignore
                vVelocity		: vDirection * 2000,
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: caster.GetTeamNumber()
            } )

            Timers.CreateTimer(delay, (function() {        
                if(ProjectileManager.IsValidProjectile(projectile)) {
                    ProjectileManager.DestroyLinearProjectile(projectile)

                    //@ts-ignore
                    spawnTree(casterPosition + (vDirection * distance), caster)
                }            
            }).bind(this))

    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        // target.proj
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const damage = this.GetSpecialValueFor('primary_state_factor') * getForceOfRuleLevel('wood', this.GetCaster()) + this.GetSpecialValueFor('base_damage')

            ApplyDamage({
                victim: target,
                attacker: this.GetCaster(),
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })
            return true;
        }
        
    }

    IsHidden(): boolean {
        return false
    }
}

export function spawnTree(position: Vector, caster: CDOTA_BaseNPC) {
    if(!caster.IsHero()) return;

    const ability = caster.FindAbilityByName(zhong_ling_shu.name)
    if(!ability) return;

    const nFXIndex = ParticleManager.CreateParticle( "particles/world_destruction_fx/dire_tree005.vpcf", ParticleAttachment.POINT, caster )  
    ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null,  position, true )
    ParticleManager.ReleaseParticleIndex( nFXIndex )

    
    Timers.CreateTimer(0.8, (function() {                        
        const forceOfRuleLevel = getForceOfRuleLevel('wood', caster)

        const tree = CreateUnitByName('zhong_ling_shu_tree', 
            position, 
            true, 
            null, 
            PlayerResource.GetPlayer(caster.GetPlayerID()), 
            caster.GetTeamNumber()
        )    
    
        tree.AddNewModifier(
            caster, 
            ability, 
            modifier_zhong_ling_shu.name, 
            {duration: ability.GetSpecialValueFor('tree_base_life') + ability.GetSpecialValueFor('life_factor') * forceOfRuleLevel}
        )
    
        ApplyDamage({
                victim: tree,
                attacker: caster,
                damage: 1,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: ability
            })
    
        tree.SetMoveCapability(UnitMoveCapability.NONE)
        tree.SetControllableByPlayer(caster.GetPlayerID(), false); 
    }))        
  
}