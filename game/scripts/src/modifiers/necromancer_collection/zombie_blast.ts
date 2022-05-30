
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_zombie_blast_buff } from "./zombie_blast_buff"; 

@registerModifier()
export class modifier_zombie_blast extends BaseModifier {
    OnCreated(params: object): void { 
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
        return 1000;
    }

    GetModifierAura(): string {
        return modifier_zombie_blast_buff.name
    }
}