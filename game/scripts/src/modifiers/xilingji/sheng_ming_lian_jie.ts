
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_sheng_ming_lian_jie extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }
    
    
    OnTakeDamage(params: ModifierInstanceEvent): number {
        if(!IsServer()) return;        
        if(params.attacker == this.GetParent()) return;
        if(params.unit != this.GetParent()) return;
        
        const caster = this.GetCaster()
        const damagePercentage = this.GetAbility().GetSpecialValueFor('damage_percentage_factor') * getForceOfRuleLevel('wood', caster);
        const damageShare = damagePercentage * params.damage / 100;

        const units = FindUnitsInRadius(
            this.GetParent().GetTeamNumber(), 
            this.GetParent().GetAbsOrigin(), 
            null, 
            this.GetAbility().GetSpecialValueFor('radius'), 
            UnitTargetTeam.FRIENDLY, 
            UnitTargetType.ALL, 
            UnitTargetFlags.NONE, 
            FindOrder.ANY, 
            false)

        const trees = []
        for(const unit of units) {            
            if(unit.GetUnitName() != 'zhong_ling_shu_tree') continue;

            trees.push(unit);
        }
        let damagePerTree = 0;

        if(trees.length > 0) {
            damagePerTree = damageShare / trees.length
        }        

        for(const tree of trees) {
            const particle = ParticleManager.CreateParticle( "particles/sheng_ming_lian_jie/sheng_ming_lian_jie.vpcf", ParticleAttachment.CUSTOMORIGIN_FOLLOW, this.GetCaster())
            ParticleManager.SetParticleControlEnt( particle, 0, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', caster.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( particle, 1, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', tree.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( particle )

            if(this.GetParent().GetHealth() > 0) {
                this.GetParent().Heal(damagePerTree, this.GetAbility());
            }            
            
            ApplyDamage({
                victim: tree,
                attacker: this.GetCaster(),
                damage: damagePerTree,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }

        
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}