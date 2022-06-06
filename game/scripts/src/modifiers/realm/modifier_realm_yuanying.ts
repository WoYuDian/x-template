
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_realm_yuanying extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(1)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.SPELL_AMPLIFY_PERCENTAGE, ModifierFunction.COOLDOWN_PERCENTAGE, ModifierFunction.MANA_BONUS, ModifierFunction.MANA_REGEN_CONSTANT]
    }

    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return this.GetStackCount() * 50
    }

    GetModifierPercentageCooldown(): number {
        return this.GetStackCount() * 10
    }

    GetModifierManaBonus(): number {    
        return this.GetStackCount() * 500;
    }

    GetModifierConstantManaRegen(): number {
        return this.GetStackCount() * 3
    }


    RemoveOnDeath(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false
    }
}