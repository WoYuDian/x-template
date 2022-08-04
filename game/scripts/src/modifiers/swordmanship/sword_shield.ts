import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"
@registerModifier()
export class modifier_sword_shield extends BaseModifier {
    damageReductionFactor: number
    swordMeanCostPerDamage: number
    particleId: ParticleID
    maxStack: number
    OnCreated(params: object): void {
        if(!IsServer()) return;
        this.damageReductionFactor = this.GetAbility().GetSpecialValueFor('stacking_probability')
        this.swordMeanCostPerDamage = this.GetAbility().GetSpecialValueFor('damage_factor')

        this.particleId = ParticleManager.CreateParticle( "particles/sword_shield/sword_shield.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControl(this.particleId, 1, Vector(10, 0 , 0))
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
		ParticleManager.ReleaseParticleIndex(this.particleId)
    }
    OnRefresh(params: object): void {
        if(!IsServer()) return;

        this.damageReductionFactor = this.GetAbility().GetSpecialValueFor('stacking_probability')
        this.swordMeanCostPerDamage = this.GetAbility().GetSpecialValueFor('damage_factor')   
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }
    
    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        const parent = this.GetParent()
        if(event.unit != parent) return;
        const swordMeanBuff = this.GetParent().FindModifierByName(modifier_sword_mean_stacking.name);
        if(!swordMeanBuff || (swordMeanBuff.GetStackCount() < 1)) return;
        
        let reductionPercentage = this.damageReductionFactor * getForceOfRuleLevel('metal', parent) / 100
        parent.Heal(reductionPercentage * event.damage, this.GetAbility())
        swordMeanBuff.DecrementStackCount()

        const impactParticle = ParticleManager.CreateParticle( "particles/units/heroes/hero_bristleback/bristleback_back_dmg.vpcf", ParticleAttachment.POINT, this.GetParent() )
        ParticleManager.SetParticleControl(impactParticle, 0, parent.GetAbsOrigin())
        ParticleManager.SetParticleControl(impactParticle, 1, parent.GetAbsOrigin())
        ParticleManager.ReleaseParticleIndex(impactParticle)
    }

    IsHidden(): boolean {
        return false
    }

}