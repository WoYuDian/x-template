
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_realm_zhuji extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(1)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MANA_BONUS, ModifierFunction.MANA_REGEN_CONSTANT]
    }

    GetModifierManaBonus(): number {    
        return this.GetStackCount() * 100;
    }

    GetModifierConstantManaRegen(): number {
        return this.GetStackCount()
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false
    }
}