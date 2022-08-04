
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_fu_su_bound extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.ROOTED]: true
        }
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_treant/treant_overgrowth_vines.vpcf'
    }

    IsPurgable(): boolean {
        return false
    }
}