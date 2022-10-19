
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { lei_dian_chang_debuff } from "./lei_dian_chang_debuff";
@registerModifier()
export class modifier_lei_dian_chang extends BaseModifier {
    OnCreated(params: object): void {
    }

    OnRefresh(params: object): void {
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
        return lei_dian_chang_debuff.name
    }

    IsHidden(): boolean {
        return true
    }
}