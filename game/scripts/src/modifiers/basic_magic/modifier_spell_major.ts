
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_spell_major extends BaseModifier {
    manaBonus: number
    manaRegen: number
    OnCreated(params: object): void {
            this.manaBonus = this.GetAbility().GetLevelSpecialValueFor('mana_bonus', this.GetAbility().GetLevel())
            this.manaRegen = this.GetAbility().GetLevelSpecialValueFor('mana_regen', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.manaBonus = this.GetAbility().GetLevelSpecialValueFor('mana_bonus', this.GetAbility().GetLevel())
        this.manaRegen = this.GetAbility().GetLevelSpecialValueFor('mana_regen', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MANA_BONUS, ModifierFunction.MANA_REGEN_CONSTANT]
    }

    GetModifierManaBonus(): number {
        return this.manaBonus
    }

    GetModifierConstantManaRegen(): number {
        return this.manaRegen            
    }
}