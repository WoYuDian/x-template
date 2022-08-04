
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_force_of_body extends BaseModifier {
    healthRegenPerStack: number = 2
    healthPerStack: number = 200
    OnCreated(params: any): void {
        this.SetStackCount(params.bonus || 0)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP, ModifierFunction.HEALTH_REGEN_CONSTANT, ModifierFunction.EXTRA_HEALTH_BONUS]
    }

    GetModifierConstantHealthRegen(): number {
        return this.GetStackCount() * this.healthRegenPerStack
    }

    GetModifierExtraHealthBonus(): number {
        return this.GetStackCount() * this.healthPerStack
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
        return 'troll_warlord_fervor'
    }
}