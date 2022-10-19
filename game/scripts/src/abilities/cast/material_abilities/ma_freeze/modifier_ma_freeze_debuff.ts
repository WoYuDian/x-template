
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { Timers } from "../../../../lib/timers";
@registerModifier()
export class modifier_ma_freeze_debuff extends BaseModifier {
    moveSpeedReduction: number = 0
    attackSpeedReduction: number = 0
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const forceOfRule = getFabaoSumOfForceOfRuleLevels(['water'], this.GetCaster())
        this.moveSpeedReduction = this.GetAbility().GetSpecialValueFor('move_speed_reduction_factor') * forceOfRule
        this.attackSpeedReduction = this.GetAbility().GetSpecialValueFor('attack_speed_reduction_factor') * forceOfRule

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))
    }   

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            moveSpeedReduction: this.moveSpeedReduction,
            attackSpeedReduction: this.attackSpeedReduction,
        }
    }

    HandleCustomTransmitterData(data) {       
        this.moveSpeedReduction = data.moveSpeedReduction
        this.attackSpeedReduction = data.attackSpeedReduction
    }  

    GetEffectName(): string {
        return 'particles/generic_gameplay/generic_slowed_cold.vpcf'
    }

    IsDebuff(): boolean {
        return true
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_BONUS_PERCENTAGE, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierMoveSpeedBonus_Percentage(): number {
        return -this.moveSpeedReduction
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return -this.attackSpeedReduction
    }
}
