
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class han_qi_ru_hun_freezing extends BaseModifier {
    damageBonusPercentage: number

    OnCreated(params: any): void {
        this.damageBonusPercentage = this.GetAbility().GetSpecialValueFor('damage_bonus_percentage');
    }

    OnRefresh(params: object): void {
        this.damageBonusPercentage = this.GetAbility().GetSpecialValueFor('damage_bonus_percentage');
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.INCOMING_DAMAGE_PERCENTAGE, ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;    
        if(event.unit != this.GetParent()) return;
        const nFXIndex = ParticleManager.CreateParticle( "particles/creatures/aghanim/aghanim_crystal_attack_impact.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( nFXIndex, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        this.SetDuration(0, true)
    }

    GetModifierIncomingDamage_Percentage(event: ModifierAttackEvent): number {
        return this.damageBonusPercentage
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.STUNNED]: true
        }    
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_crystalmaiden/maiden_frostbite_buff.vpcf'
    }

    IsDebuff(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return false
    }
}