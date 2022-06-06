
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { cold_touch_freezing } from "./cold_touch_freezing";
@registerModifier()
export class cold_touch_debuff extends BaseModifier {
    maxStack: number
    freezingDuration: number
    damageBonusPercentage: number
    regenReductionPerStack: number
    debuffDuration: number

    OnCreated(params: any): void {
        this.SetStackCount(1)
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.freezingDuration = this.GetAbility().GetSpecialValueFor('freezing_duration');
        this.damageBonusPercentage = this.GetAbility().GetSpecialValueFor('damage_bonus_percentage');
        this.regenReductionPerStack = this.GetAbility().GetSpecialValueFor('regen_reduction_per_stack');
        this.debuffDuration = this.GetAbility().GetSpecialValueFor('debuff_duration');
    }

    OnRefresh(params: object): void {
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.freezingDuration = this.GetAbility().GetSpecialValueFor('freezing_duration');
        this.damageBonusPercentage = this.GetAbility().GetSpecialValueFor('damage_bonus_percentage');
        this.regenReductionPerStack = this.GetAbility().GetSpecialValueFor('regen_reduction_per_stack');
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