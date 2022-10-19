
import { rollDrops } from "../../game_logic/game_operation";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_generic_orb_effect } from "../modifier_generic_orb_effect";
import { Timers } from "../../lib/timers";
@registerModifier()
export class modifier_practice_creep extends BaseModifier {
    roundCount: number
    OnCreated(params: object): void {
        if(!IsServer()) return;

        //@ts-ignore
        this.roundCount = params.round_count || 0
        const bonusScale = 1 + (this.roundCount / 6)
        const parent = this.GetParent()
        //@ts-ignore
        parent.params = parent.params || {}
        //@ts-ignore
        parent.params.bonusParams = {scale: bonusScale}
        parent.SetDeathXP(Math.ceil(parent.GetDeathXP() * bonusScale))

        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
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
            roundCount: this.roundCount,
        }
    }

    HandleCustomTransmitterData(data) {      
        this.roundCount = data.roundCount
    }

    GetTexture(): string {
        return 'lone_druid_spirit_bear'
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.MODEL_SCALE, 
            ModifierFunction.EXTRA_HEALTH_BONUS, 
            ModifierFunction.PREATTACK_BONUS_DAMAGE, 
            ModifierFunction.ATTACKSPEED_BONUS_CONSTANT,
        ]
    }

    GetModifierModelScale(): number {
        return this.roundCount * 0.1
    }

    GetModifierExtraHealthBonus(): number {
        return this.roundCount * 20
    }

    GetModifierPreAttack_BonusDamage(): number {
        return this.roundCount * 2
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.roundCount * 2
    }

    IsHidden(): boolean {
        return true;
    }
}