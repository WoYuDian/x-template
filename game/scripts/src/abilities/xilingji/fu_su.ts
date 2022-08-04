import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_fu_su_bound } from "../../modifiers/xilingji/fu_su_bound";
import { modifier_fu_su_transfiguration } from "../../modifiers/xilingji/fu_su_transfiguration";
import { findUnitsInRing } from "../../util";
@registerAbility()
export class fu_su extends BaseAbility
{    
    OnSpellStart(): void {  
        if(!IsServer()) return
        
        const radius = this.GetSpecialValueFor('radius');

        const caster = this.GetCaster()
        const particle = ParticleManager.CreateParticle( "particles/fu_su/fu_su.vpcf", ParticleAttachment.POINT, this.GetCaster())
        ParticleManager.SetParticleControlEnt( particle, 0, null, ParticleAttachment.POINT, null, caster.GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( particle, 1, null, ParticleAttachment.POINT, null, Vector(radius / 1.5, radius / 1.5, 0), true )
        ParticleManager.ReleaseParticleIndex( particle )

        const spreadTime = 1
        let curTick = 0
        const tickTime = 0.1
        const totalTick = spreadTime / tickTime;
        const casterPosition = caster.GetAbsOrigin()
        const forceOfRuleLevel = getForceOfRuleLevel('wood', caster)
        const treantAttack = this.GetSpecialValueFor('attack_factor') * forceOfRuleLevel
        const treantAttackSpeed = this.GetSpecialValueFor('attack_speed_factor') * forceOfRuleLevel
        Timers.CreateTimer((function() {
            const innerRadius = (curTick) * radius / totalTick
            const outerRadius = (curTick + 1) * radius / totalTick
            const units = findUnitsInRing(caster.GetTeamNumber(), null, casterPosition, outerRadius, innerRadius, UnitTargetTeam.BOTH, UnitTargetType.BASIC + UnitTargetType.HERO, UnitTargetFlags.NONE, FindOrder.ANY, false)
            
            for(const unit of units) {
                if((unit.GetUnitName() == 'zhong_ling_shu_tree') && (unit.GetTeamNumber() == caster.GetTeamNumber())) {
                    unit.AddNewModifier(caster, this, modifier_fu_su_transfiguration.name, {})
                } else if (unit.GetTeamNumber() != caster.GetTeamNumber()) {
                    unit.AddNewModifier(caster, this, modifier_fu_su_bound.name, {duration: this.GetSpecialValueFor('bound_duration_factor') * forceOfRuleLevel})
                    ApplyDamage({
                        victim: unit,
                        attacker: this.GetCaster(),
                        damage: this.GetSpecialValueFor('damage_factor') * forceOfRuleLevel,
                        damage_type: DamageTypes.MAGICAL,
                        damage_flags: DamageFlag.NONE,
                        ability: this
                    })
                }
            }

            curTick += 1;
            if(curTick <= totalTick) {
                return tickTime
            }
        }).bind(this))
    }

    IsHidden(): boolean {
        return false
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('radius')
    }
}