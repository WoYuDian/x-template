
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fitness_tenacity extends BaseModifier {
    statusResistnace: number
    OnCreated(params: object): void {
        this.statusResistnace = this.GetAbility().GetLevelSpecialValueFor('status_resistance', this.GetAbility().GetLevel() - 1)  
    }

    OnRefresh(params: object): void {
        this.statusResistnace = this.GetAbility().GetLevelSpecialValueFor('status_resistance', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.STATUS_RESISTANCE]
    }

    GetModifierStatusResistance(): number {
        return this.statusResistnace   
    }
}