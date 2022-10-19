
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class zhuo_mu_debuff extends BaseModifier {
    primaryStateFactor: number
    particle: ParticleID
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.particle = ParticleManager.CreateParticle("particles/items2_fx/radiance.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
        ParticleManager.SetParticleControl(this.particle, 0, this.GetParent().GetAbsOrigin())
        ParticleManager.SetParticleControl(this.particle, 1, this.GetParent().GetAbsOrigin())
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particle, false)
		ParticleManager.ReleaseParticleIndex(this.particle)
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.AVOID_DAMAGE]
    }

    GetTexture(): string {
        return 'zhuo_mu'
    }

    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        if(!IsServer()) return;
        if(event.attacker != this.GetParent()) return 0;

        const caster = this.GetAbility().GetCaster()
        const probability = getForceOfRuleLevel('fire', caster) * this.primaryStateFactor

        if(RollPercentage(probability)) {
            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_clinkz/clinkz_strafe_dodge.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, event.target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
            
            return 1
        } else {
            return 0
        }
    }

    // OnTakeDamage(event: ModifierInstanceEvent): void {

    //     const caster = this.GetAbility().GetCaster()
    //     const probability = getForceOfRuleLevel('fire', caster) * this.primaryStateFactor

    //     if(RollPercentage(probability)) {
    //         const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_clinkz/clinkz_strafe_dodge.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, event.unit )
    //         ParticleManager.SetParticleControlEnt( nFXIndex, 1, event.unit, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.unit.GetAbsOrigin(), true )
    //         ParticleManager.SetParticleControlEnt( nFXIndex, 3, event.unit, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.unit.GetAbsOrigin(), true )
    //         ParticleManager.ReleaseParticleIndex( nFXIndex )
    //         event.unit.Heal(event.damage, this.GetAbility())
    //     } 
    // }
}