
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_mana_recovery_debuff } from "./modifier_mana_recovery_debuff";
@registerModifier()
export class modifier_mana_recovery extends BaseModifier {
    recoveryProbability: number
    recoveryPercentage: number
    OnCreated(params: object): void {
            this.recoveryProbability = this.GetAbility().GetSpecialValueFor('recovery_probability')
            this.recoveryPercentage = this.GetAbility().GetSpecialValueFor('recovery_percentage')   
    }

    OnRefresh(params: object): void {
        this.recoveryProbability = this.GetAbility().GetSpecialValueFor('recovery_probability')
        this.recoveryPercentage = this.GetAbility().GetSpecialValueFor('recovery_percentage')
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return 1000;
    }

    GetModifierAura(): string {
        return modifier_mana_recovery_debuff.name
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP, ModifierFunction.TOOLTIP2]
    }

    OnTooltip(): number {
        return this.recoveryProbability
    }

    OnTooltip2(): number {
        return this.recoveryPercentage
    }
}