
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_realm_jindan extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(1)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.SPELL_AMPLIFY_PERCENTAGE, ModifierFunction.MANA_BONUS, ModifierFunction.MANA_REGEN_CONSTANT]
    }

    GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        return this.GetStackCount() * 40
    }

    GetModifierManaBonus(): number {    
        return this.GetStackCount() * 300;
    }

    GetModifierConstantManaRegen(): number {
        return this.GetStackCount() * 2
    }


    RemoveOnDeath(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false
    }
}