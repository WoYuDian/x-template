


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";

@registerModifier()
export class modifier_ju_jian_shu extends BaseModifier {
    healthFactor: number = 0
    forceOfMetal: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.healthFactor = this.GetAbility().GetSpecialValueFor('health_factor')
        this.forceOfMetal = getForceOfRuleLevel('metal', this.GetAbility().GetCaster())
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    GetEffectName(): string {
        return 'particles/ju_jian_shu/ju_jian_shu.vpcf'
    }

    AddCustomTransmitterData() {
        return {
            healthFactor: this.healthFactor,
            forceOfMetal: this.forceOfMetal,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.healthFactor = data.healthFactor
        this.forceOfMetal = data.forceOfMetal
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.EXTRA_HEALTH_BONUS]
    }

    GetModifierExtraHealthBonus(): number {
        return this.healthFactor * this.forceOfMetal
    }

    IsPurgable(): boolean {
        return false
    }    

    IsHidden(): boolean {
        return true
    }
}