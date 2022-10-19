
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { zhuo_mu_debuff } from "./zhuo_mu_debuff";
@registerModifier()
export class modifier_zhuo_mu extends BaseModifier {
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

    GetEffectName(): string {
        return 'particles/econ/items/monkey_king/arcana/monkey_king_arcana_fire.vpcf'
    }

    GetModifierAura(): string {
        return zhuo_mu_debuff.name
    }

    IsHidden(): boolean {
        return true
    }
}