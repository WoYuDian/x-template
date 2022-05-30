
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fitness_enhancement extends BaseModifier {
    healthBonus: number
    healthRegen: number
    OnCreated(params: object): void {
            this.healthBonus = this.GetAbility().GetLevelSpecialValueFor('health_bonus', this.GetAbility().GetLevel())
            this.healthRegen = this.GetAbility().GetLevelSpecialValueFor('health_regen', this.GetAbility().GetLevel() - 1)  
    }

    OnRefresh(params: object): void {
            this.healthBonus = this.GetAbility().GetLevelSpecialValueFor('health_bonus', this.GetAbility().GetLevel())
            this.healthRegen = this.GetAbility().GetLevelSpecialValueFor('health_regen', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.HEALTH_BONUS, ModifierFunction.HEALTH_REGEN_CONSTANT]
    }

    GetModifierHealthBonus(): number {
        return this.healthBonus
    }

    GetModifierConstantHealthRegen(): number {
        return this.healthRegen
    }
}