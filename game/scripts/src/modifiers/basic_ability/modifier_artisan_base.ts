
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_artisan_base extends BaseModifier {
    armorBonus: number
    magicResistance: number
    OnCreated(params: object): void {
            this.armorBonus = this.GetAbility().GetLevelSpecialValueFor('armor_bonus', this.GetAbility().GetLevel() - 1)
            this.magicResistance = this.GetAbility().GetLevelSpecialValueFor('magic_resistance', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.armorBonus = this.GetAbility().GetLevelSpecialValueFor('armor_bonus', this.GetAbility().GetLevel() - 1)
        this.magicResistance = this.GetAbility().GetLevelSpecialValueFor('magic_resistance', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS, ModifierFunction.MAGICAL_RESISTANCE_BONUS]
    }

    GetModifierPhysicalArmorBonus(event: ModifierAttackEvent): number {
        return this.armorBonus
    }

    GetModifierMagicalResistanceBonus(event: ModifierAttackEvent): number {
        return this.magicResistance
    }
    
    GetAuraRadius(): number {
        return 1000
    } 

    GetModifierAura(): string {
        return 'modifier_skeleton_king_vampiric_aura'
    }

    GetAuraSearchFlags(): UnitTargetFlags {
        return UnitTargetFlags.NONE
    }

    GetAuraSearchTeam(): UnitTargetTeam {
       return UnitTargetTeam.FRIENDLY 
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.HERO
    }

    IsAura(): boolean {
        return true;
    }
}