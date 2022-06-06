
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ice_piton extends BaseModifier {
    slowRate: number
    OnCreated(params: any): void {
        this.slowRate = this.GetAbility().GetSpecialValueFor('slow_rate')
    }

    OnRefresh(params: object): void {
        this.slowRate = this.GetAbility().GetSpecialValueFor('slow_rate')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.slowRate
    }

    IsDebuff(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return true
    }

    GetEffectName(): string {
        return 'particles/generic_gameplay/generic_slowed_cold.vpcf'
    }
}