
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_shi_jian_dui_ji_debuff } from "./shi_jian_dui_ji_debuff"; 

@registerModifier()
export class modifier_shi_jian_dui_ji extends BaseModifier {
    OnCreated(params: object): void { 
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
        return this.GetAbility().GetSpecialValueFor('radius');
    }

    GetModifierAura(): string {
        return modifier_shi_jian_dui_ji_debuff.name
    }
}