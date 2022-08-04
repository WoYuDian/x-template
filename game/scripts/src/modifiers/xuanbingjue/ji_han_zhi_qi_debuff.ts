
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class ji_han_zhi_qi_debuff extends BaseModifier {
    maxStack: number = 0
    moveSlowRatePerStack: number = 0
    attackSlowRatePerStack: number = 0
    debuffDuration: number = 0

    OnCreated(params: any): void {
        this.SetStackCount(1)
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.moveSlowRatePerStack = this.GetAbility().GetSpecialValueFor('move_slow_rate_per_stack');
        this.attackSlowRatePerStack = this.GetAbility().GetSpecialValueFor('attack_slow_rate_per_stack');
        this.debuffDuration = this.GetAbility().GetSpecialValueFor('debuff_duration');
    }

    OnRefresh(params: object): void {
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack_level');
        this.moveSlowRatePerStack = this.GetAbility().GetSpecialValueFor('move_slow_rate_per_stack');
        this.attackSlowRatePerStack = this.GetAbility().GetSpecialValueFor('attack_slow_rate_per_stack');
        this.debuffDuration = this.GetAbility().GetSpecialValueFor('debuff_duration');
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return -(this.GetStackCount() * this.moveSlowRatePerStack)
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -(this.GetStackCount() * this.attackSlowRatePerStack)
    }

    IsPurgable(): boolean {
        return false
    }

    GetEffectName(): string {
        return 'particles/generic_gameplay/generic_slowed_cold.vpcf'
    }
}