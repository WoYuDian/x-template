
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_yan_dun extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOTAL_CONSTANT_BLOCK]
    }

    GetModifierTotal_ConstantBlock(event: ModifierAttackEvent): number {
        if(!IsServer()) return;
        return getForceOfRuleLevel('rock', this.GetParent()) * this.GetAbility().GetSpecialValueFor('block_factor')
    }

    GetEffectName(): string {
        return 'particles/yan_dun/yan_dun.vpcf'
    }

    IsPurgable(): boolean {
        return false
    }
}