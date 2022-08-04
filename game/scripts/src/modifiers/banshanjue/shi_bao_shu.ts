
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_shi_bao_shu_buff } from "./shi_bao_shu_buff";
@registerModifier()
export class modifier_shi_bao_shu extends BaseModifier {
    OnCreated(params: object): void { 
    }

    OnRefresh(params: object): void {
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('radius');
    }

    GetModifierAura(): string {
        return modifier_shi_bao_shu_buff.name
    }
}