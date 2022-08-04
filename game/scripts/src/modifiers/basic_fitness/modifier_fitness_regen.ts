
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fitness_regen extends BaseModifier {
    healthRegenFactor: number
    particleId: ParticleID
    OnCreated(params: object): void {
            this.healthRegenFactor = this.GetAbility().GetLevelSpecialValueFor('health_regen_factor', this.GetAbility().GetLevel() - 1)  
            this.particleId = ParticleManager.CreateParticle( "particles/units/heroes/hero_treant/treant_livingarmor_regen.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
            ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
            ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
		ParticleManager.ReleaseParticleIndex(this.particleId)
    }
    OnRefresh(params: object): void {
            this.healthRegenFactor = this.GetAbility().GetLevelSpecialValueFor('health_regen_factor', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.HEALTH_REGEN_CONSTANT]
    }

    GetModifierConstantHealthRegen(): number {
        return (this.GetParent().GetMaxHealth() - this.GetParent().GetHealth()) * this.healthRegenFactor
    }
}