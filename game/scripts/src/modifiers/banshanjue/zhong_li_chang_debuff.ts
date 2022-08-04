
import { rollDrops } from "../../game_logic/game_operation";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_zhong_li_chang_debuff extends BaseModifier {
    moveSpeedReductionFactor: number = 0
    attackSpeedReductionFactor: number = 0
    forceOfRock: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.moveSpeedReductionFactor = this.GetAbility().GetSpecialValueFor('move_speed_reduction_factor')
        this.forceOfRock = getForceOfRuleLevel('rock', this.GetAbility().GetCaster())
        this.attackSpeedReductionFactor = this.GetAbility().GetSpecialValueFor('attack_speed_reduction_factor')
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
            forceOfRock: this.forceOfRock,
            attackSpeedReductionFactor: this.attackSpeedReductionFactor,
        }
    }

    HandleCustomTransmitterData(data) {      
        this.moveSpeedReductionFactor = data.moveSpeedReductionFactor
        this.forceOfRock = data.forceOfRock
        this.attackSpeedReductionFactor = data.attackSpeedReductionFactor
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_CONSTANT, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierMoveSpeedBonus_Constant(): number {
        return -this.moveSpeedReductionFactor * this.forceOfRock
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return -this.attackSpeedReductionFactor * this.forceOfRock
    }

    IsDebuff(): boolean {
        return true
    }

    IsPurgable(): boolean {
        return false
    }
}