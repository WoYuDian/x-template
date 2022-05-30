
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fitness_dodge extends BaseModifier {
    dodgeProbability: number
    OnCreated(params: object): void {
            this.dodgeProbability = this.GetAbility().GetLevelSpecialValueFor('dodge_probability', this.GetAbility().GetLevel() - 1)  
    }

    OnRefresh(params: object): void {
            this.dodgeProbability = this.GetAbility().GetLevelSpecialValueFor('dodge_probability', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.AVOID_DAMAGE]
    }

    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        if((event.attacker != this.GetAbility().GetOwner()) && (event.target == this.GetAbility().GetOwner())) {
            if(RollPercentage(this.dodgeProbability)) {
                const nFXIndex = ParticleManager.CreateParticle( "particles/generic_gameplay/illusion_killed_halo.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, event.target )
                ParticleManager.SetParticleControlEnt( nFXIndex, 1, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetOrigin(), true )
                ParticleManager.SetParticleControlEnt( nFXIndex, 3, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetOrigin(), true )
                ParticleManager.ReleaseParticleIndex( nFXIndex )
                return 1
            } else {
                return 0
            }            
        }
        
    }
}