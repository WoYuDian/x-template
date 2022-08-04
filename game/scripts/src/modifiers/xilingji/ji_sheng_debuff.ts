


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class ji_sheng_debuff extends BaseModifier {
    manaRecoverFactor: number = 0
    damagePercentage: number = 0
    recoverInterval: number = 0
    particleId: ParticleID
    OnCreated(params: any): void {
        this.manaRecoverFactor = this.GetAbility().GetSpecialValueFor('mana_recover_factor')
        this.damagePercentage = this.GetAbility().GetSpecialValueFor('damage_percentage')
        this.recoverInterval = this.GetAbility().GetSpecialValueFor('recover_interval')
        this.StartIntervalThink(this.recoverInterval)
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_treant/treant_eyesintheforest.vpcf'
    }

    OnRefresh(params: object): void {
        this.manaRecoverFactor = this.GetAbility().GetSpecialValueFor('mana_recover_factor')
        this.damagePercentage = this.GetAbility().GetSpecialValueFor('damage_percentage')
        this.recoverInterval = this.GetAbility().GetSpecialValueFor('recover_interval')
    }        

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        const manaRecovery = this.manaRecoverFactor * getForceOfRuleLevel('wood', this.GetCaster());

        if(this.GetParent().GetTeamNumber() != this.GetCaster().GetTeam()) {
            ApplyDamage({
                victim: this.GetParent(),
                attacker: this.GetCaster(),
                damage: manaRecovery * this.damagePercentage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }

        const nFXIndex = ParticleManager.CreateParticle( "particles/generic_gameplay/generic_lifesteal_blue.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetCaster() )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, this.GetCaster(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetCaster().GetOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        this.GetCaster().GiveMana(manaRecovery)
    }

    IsDebuff(): boolean {
        return this.GetCaster().GetTeamNumber() == this.GetParent().GetTeamNumber()
    }

    IsPurgable(): boolean {
        return false
    }


    // OnKill(): void {
    //     const nFXIndex = ParticleManager.CreateParticle( "particles/world_destruction_fx/tree_oak_01_destruction.vpcf", ParticleAttachment.POINT, this.GetCaster() )            
    //     ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null,  this.GetParent().GetAbsOrigin(), true )
    //     ParticleManager.ReleaseParticleIndex( nFXIndex )
    // }
}