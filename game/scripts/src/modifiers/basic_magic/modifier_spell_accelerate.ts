
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_spell_accelerate extends BaseModifier {
    coolDownReduction: number
    OnCreated(params: object): void {
            this.coolDownReduction = this.GetAbility().GetLevelSpecialValueFor('cool_down_reduction', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.coolDownReduction = this.GetAbility().GetLevelSpecialValueFor('cool_down_reduction', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.COOLDOWN_PERCENTAGE]
    }

    GetModifierPercentageCooldown(event: ModifierAbilityEvent): number {
        return this.coolDownReduction
    }
}