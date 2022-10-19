
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_yan_dun extends BaseModifier {
    forceOfRule: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.forceOfRule = getForceOfRuleLevel('rock', this.GetParent())
        this.SetHasCustomTransmitterData(true)

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        this.OnRefresh({})
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            forceOfRule: this.forceOfRule,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.forceOfRule = data.forceOfRule
    } 

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOTAL_CONSTANT_BLOCK]
    }

    GetModifierTotal_ConstantBlock(event: ModifierAttackEvent): number {
        return this.forceOfRule * this.GetAbility().GetSpecialValueFor('block_factor')
    }

    GetEffectName(): string {
        return 'particles/yan_dun/yan_dun.vpcf'
    }

    IsPurgable(): boolean {
        return false
    }
}