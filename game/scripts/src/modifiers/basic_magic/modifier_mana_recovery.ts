
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_mana_recovery_debuff } from "./modifier_mana_recovery_debuff";
@registerModifier()
export class modifier_mana_recovery extends BaseModifier {
    recoveryProbability: number
    recoveryPercentage: number
    OnCreated(params: object): void {
            this.recoveryProbability = this.GetAbility().GetLevelSpecialValueFor('recovery_probability', this.GetAbility().GetLevel())
            this.recoveryPercentage = this.GetAbility().GetLevelSpecialValueFor('recovery_percentage', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.recoveryProbability = this.GetAbility().GetLevelSpecialValueFor('recovery_probability', this.GetAbility().GetLevel())
        this.recoveryPercentage = this.GetAbility().GetLevelSpecialValueFor('recovery_percentage', this.GetAbility().GetLevel() - 1)
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
}