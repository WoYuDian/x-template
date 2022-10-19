
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_zhong_li_chang_debuff } from "./zhong_li_chang_debuff";
@registerModifier()
export class modifier_zhong_li_chang extends BaseModifier {
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
        return this.GetAbility().GetSpecialValueFor('radius');
    }

    GetModifierAura(): string {
        return modifier_zhong_li_chang_debuff.name
    }

    IsHidden(): boolean {
        return true;
    }
}