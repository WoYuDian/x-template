
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class han_qi_ru_ti_debuff extends BaseModifier {
    maxStack: number
    damageBonusPercentage: number
    regenReductionPerStack: number
    debuffDuration: number

    OnCreated(params: any): void {
        this.SetStackCount(1)
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.regenReductionPerStack = this.GetAbility().GetSpecialValueFor('regen_reduction_per_stack');
        this.debuffDuration = this.GetAbility().GetSpecialValueFor('debuff_duration');
    }

    OnRefresh(params: object): void {
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.damageBonusPercentage = this.GetAbility().GetSpecialValueFor('damage_bonus_percentage');
        this.debuffDuration = this.GetAbility().GetSpecialValueFor('debuff_duration');
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.HEALTH_REGEN_PERCENTAGE, ModifierFunction.MANA_REGEN_TOTAL_PERCENTAGE]
    }

    GetModifierHealthRegenPercentage(): number {
        return -this.GetStackCount() * this.regenReductionPerStack / 10
    }

    GetModifierTotalPercentageManaRegen(): number {
        return -this.GetStackCount() * this.regenReductionPerStack / 2
    }    

    IsPurgable(): boolean {
        return false
    }
}