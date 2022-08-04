
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_resentment_stacking_buff } from "./resentment_stacking_buff"; 

@registerModifier()
export class modifier_resentment_stacking extends BaseModifier {
    OnCreated(params: object): void { 
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.BOTH
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.BASIC + UnitTargetType.HERO
    }

    GetAuraRadius(): number {
        return 1000;
    }

    GetModifierAura(): string {
        return modifier_resentment_stacking_buff.name
    }
}