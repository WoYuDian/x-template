
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { modifier_ma_shehun_debuff } from "./modifier_ma_shehun_debuff";

@registerModifier()
export class modifier_ma_shehun extends BaseModifier {
    OnCreated(params: object): void {
        if(!IsServer()) return;

        
        const particle = ParticleManager.CreateParticle( "particles/units/heroes/hero_necrolyte/necrolyte_ambient_glow.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particle, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particle, false, false, -1, false, false) 

        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('decay_interval'))
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        if(this.GetStackCount() > 0) {
            this.DecrementStackCount()
        }
    }
    
    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.BOTH
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('aura_radius')
    }

    GetModifierAura(): string {
        return modifier_ma_shehun_debuff.name
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_necrolyte/necrolyte_ambient_glow.vpcf'
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.SPELL_AMPLIFY_PERCENTAGE, ModifierFunction.MODEL_SCALE]
    }

    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return this.GetStackCount() * this.GetAbility().GetSpecialValueFor('spell_amplify_per_stack')
    }

    GetModifierModelScale(): number {
        return this.GetStackCount() * 5
    }
    
}
