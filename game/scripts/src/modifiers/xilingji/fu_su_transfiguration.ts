
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_fu_su_transfiguration extends BaseModifier {
    attackFactor: number = 0
    attackSpeedFactor: number = 0
    forceOfWood: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.GetParent().SetAttackCapability(UnitAttackCapability.MELEE_ATTACK)
        
        this.attackFactor = this.GetAbility().GetSpecialValueFor('attack_factor')
        this.attackSpeedFactor = this.GetAbility().GetSpecialValueFor('attack_speed_factor')
        this.forceOfWood = getForceOfRuleLevel('wood', this.GetAbility().GetCaster())
        this.SetStackCount(1)

        this.SetHasCustomTransmitterData(true)
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            attackFactor: this.attackFactor,
            attackSpeedFactor: this.attackSpeedFactor,
            forceOfWood: this.forceOfWood
        }
    }

    HandleCustomTransmitterData(data) {
        this.attackFactor = data.attackFactor
        this.attackSpeedFactor = data.attackSpeedFactor
        this.forceOfWood = data.forceOfWood
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MODEL_CHANGE, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, ModifierFunction.BASEATTACK_BONUSDAMAGE, ModifierFunction.ATTACK_RANGE_BONUS]
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackSpeedFactor * this.forceOfWood
    }

    GetModifierBaseAttack_BonusDamage(): number {
        return this.attackFactor * this.forceOfWood
    }

    GetModifierAttackRangeBonus(): number {
        return 100
    }

    GetModifierModelChange(): string {
        return 'models/heroes/furion/treant.vmdl'
    }

    IsPurgable(): boolean {
        return false
    }
}