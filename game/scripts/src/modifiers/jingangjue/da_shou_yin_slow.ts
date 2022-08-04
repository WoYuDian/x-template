
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_da_shou_yin_slow extends BaseModifier {
    moveSpeedReductionFactor: number = 0
    forceOfRule: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.moveSpeedReductionFactor = this.GetAbility().GetSpecialValueFor('move_speed_reduction_factor')
        this.forceOfRule = getForceOfRuleLevel('body', this.GetAbility().GetCaster()) + getForceOfRuleLevel('metal', this.GetAbility().GetCaster())
        this.SetHasCustomTransmitterData(true)

        this.StartIntervalThink(0.1)
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
            moveSpeedReductionFactor: this.moveSpeedReductionFactor,
            forceOfRock: this.forceOfRule,
        }
    }

    HandleCustomTransmitterData(data) {      
        this.moveSpeedReductionFactor = data.moveSpeedReductionFactor
        this.forceOfRule = data.forceOfRock
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE]
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.moveSpeedReductionFactor * this.forceOfRule
    }

    IsDebuff(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return false
    }
}