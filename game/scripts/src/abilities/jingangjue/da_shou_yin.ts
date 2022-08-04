import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { modifier_da_shou_yin_slow } from "../../modifiers/jingangjue/da_shou_yin_slow";
import { modifier_da_shou_yin_rooted } from "../../modifiers/jingangjue/da_shou_yin_rooted";
@registerAbility()
export class da_shou_yin extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster()
            
        const buff = caster.FindModifierByName(modifier_luo_han_quan.name)
        const buffCost = this.GetSpecialValueFor('buff_cost')
        if(!buff ||(buff.GetStackCount() < buffCost)) return;        

        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        const nFXIndex = ParticleManager.CreateParticle( "particles/da_shou_yin/da_shou_yin.vpcf", ParticleAttachment.WORLDORIGIN, caster )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.WORLDORIGIN, null, vPos, true )
        ParticleManager.SetParticleControlEnt( nFXIndex, 15, null, ParticleAttachment.WORLDORIGIN, null, vPos, true )
        //@ts-ignore
        ParticleManager.ReleaseParticleIndex( nFXIndex )
        
        const radius = this.GetSpecialValueFor('radius')

        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            vPos, 
            null, 
            radius, 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        for(const enemy of enemies) {
            enemy.AddNewModifier(caster, this, modifier_da_shou_yin_slow.name, {
                duration: this.GetSpecialValueFor('slow_duration')
            })
        }
        Timers.CreateTimer(this.GetSpecialValueFor('delay'), (function() {
            const forceOfRule = getForceOfRuleLevel('metal', caster) + getForceOfRuleLevel('body', caster);
            const damage = this.GetSpecialValueFor('damage_factor') * forceOfRule
            const curEnemies = FindUnitsInRadius(
                caster.GetTeamNumber(), 
                vPos, 
                null, 
                radius, 
                UnitTargetTeam.ENEMY, 
                UnitTargetType.BASIC + UnitTargetType.HERO, 
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false)
            for(const enemy of curEnemies) {
                ApplyDamage({
                    victim: enemy,
                    attacker: caster,
                    damage: damage,
                    damage_type: DamageTypes.PHYSICAL,
                    damage_flags: DamageFlag.NONE,
                    ability: this
                })

                enemy.AddNewModifier(caster, this, modifier_da_shou_yin_rooted.name, {
                    duration: this.GetSpecialValueFor('root_duration_factor') * forceOfRule
                })
            }
        }).bind(this))

        buff.SetStackCount(buff.GetStackCount() - buffCost)
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    IsHidden(): boolean {
        return false
    }
} 