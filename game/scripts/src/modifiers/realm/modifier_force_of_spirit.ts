
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_force_of_spirit extends BaseModifier {
    visionPerStack: number = 10
    statusResistancePerStack: number = 2
    OnCreated(params: any): void {
        this.SetStackCount(params.bonus || 0)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP, ModifierFunction.BONUS_DAY_VISION, ModifierFunction.BONUS_NIGHT_VISION, ModifierFunction.STATUS_RESISTANCE]
    }

    OnTooltip(): number {
        return this.GetStackCount()           
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false
    }

    GetTexture(): string {
        return 'wisp_spirits'
    }

    GetBonusDayVision(): number {
        return this.GetStackCount() * this.visionPerStack
    }

    GetBonusNightVision(): number {
        return this.GetStackCount() * this.visionPerStack
    }

    GetModifierStatusResistance(): number {
        return this.GetStackCount() * this.statusResistancePerStack
    }
}