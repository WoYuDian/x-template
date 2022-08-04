import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shan_yue_zhi_li } from "../../modifiers/banshanjue/shan_yue_zhi_li"

@registerAbility()
export class shan_yue_zhi_li extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_shan_yue_zhi_li.name
    }

    GetAbilityTargetFlags(): UnitTargetFlags {
        return UnitTargetFlags.NONE
    }
    
    OnOrbFire() {
    }

    OnOrbImpact(event: ModifierAttackEvent) {        
        const target = event.target;
        const caster = this.GetCaster()
        const shanYueZhiLiBuff = caster.FindModifierByName(modifier_shan_yue_zhi_li.name);
        if(shanYueZhiLiBuff.GetStackCount() < this.GetSpecialValueFor('point_cost_per_attack')) return

        const nFXIndex = ParticleManager.CreateParticle( "particles/econ/items/earthshaker/earthshaker_totem_ti6/earthshaker_totem_ti6_leap_impact.vpcf", ParticleAttachment.POINT, this.GetCaster() ) 
                      
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, target.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        shanYueZhiLiBuff.SetStackCount(shanYueZhiLiBuff.GetStackCount() - this.GetSpecialValueFor('point_cost_per_attack'))

        const forceOfRuleLevel = getForceOfRuleLevel('rock', caster);
        const damage = this.GetSpecialValueFor('damage_factor') * forceOfRuleLevel;
        const duration = this.GetSpecialValueFor('stun_duration_factor') * forceOfRuleLevel;
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            target.GetAbsOrigin(), 
            null, 
            this.GetSpecialValueFor('radius'), 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        for(const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            enemy.AddNewModifier(caster, this, 'modifier_stunned', {duration: duration})
        }
    }

    OnSpellStart(): void {        
        if(!IsServer()) return

        this.GetCaster().MoveToTargetToAttack(this.GetCursorTarget())
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        const caster = this.GetCaster()

        if(target != caster) return        
        
        const shanYueZhiLiBuff = caster.FindModifierByName(modifier_shan_yue_zhi_li.name);

        if(shanYueZhiLiBuff.GetStackCount() < this.GetSpecialValueFor('max_stack')) {            
            shanYueZhiLiBuff.IncrementStackCount()
        }        
    }
}