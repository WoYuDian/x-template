


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_hui_chun_shu extends BaseModifier {
    healthHealPerManaFactor: number = 0
    manaCostPerWave: number = 0
    waveInterval: number = 0
    particleId: ParticleID
    OnCreated(params: any): void {
        this.healthHealPerManaFactor = this.GetAbility().GetSpecialValueFor('health_heal_per_mana_factor')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.waveInterval = this.GetAbility().GetSpecialValueFor('wave_interval')
        this.StartIntervalThink(this.waveInterval)

        if(!IsServer()) return;
        this.particleId = ParticleManager.CreateParticle( "particles/units/heroes/hero_treant/treant_livingarmor_regen.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
		ParticleManager.ReleaseParticleIndex(this.particleId)
    }

    // GetEffectName(): string {
    //     return 'particles/units/heroes/hero_treant/treant_livingarmor_regen.vpcf'
    // }

    OnRefresh(params: object): void {
        this.healthHealPerManaFactor = this.GetAbility().GetSpecialValueFor('health_heal_per_mana_factor')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.waveInterval = this.GetAbility().GetSpecialValueFor('wave_interval')
    }        

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        if(this.GetParent().GetMana() >= this.manaCostPerWave) {
            this.GetParent().ReduceMana(this.manaCostPerWave)
            this.GetParent().Heal(this.healthHealPerManaFactor * this.manaCostPerWave * getForceOfRuleLevel('wood', this.GetCaster()), this.GetAbility())
        }
    }

    IsPurgable(): boolean {
        return false
    }
}