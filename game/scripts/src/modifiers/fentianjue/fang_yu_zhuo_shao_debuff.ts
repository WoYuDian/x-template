
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class fang_yu_zhuo_shao_debuff extends BaseModifier {
    reductionFactor: number = 0
    forceOfFire: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;
        this.reductionFactor = this.GetAbility().GetSpecialValueFor('reduction_factor')
        this.forceOfFire = getForceOfRuleLevel('fire', this.GetAbility().GetCaster())
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
            reductionFactor: this.reductionFactor,
            forceOfFire: this.forceOfFire
        }
    }

    HandleCustomTransmitterData(data) {
        this.reductionFactor = data.reductionFactor
        this.forceOfFire = data.forceOfFire
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.INCOMING_DAMAGE_PERCENTAGE]
    }

    GetModifierIncomingDamage_Percentage(event: ModifierAttackEvent): number {
        return this.reductionFactor * this.GetStackCount() * this.forceOfFire
    }

    IsPurgable(): boolean {
        return true
    }

    IsDebuff(): boolean {
        return true;
    }

    GetEffectName(): string {
        return 'particles/items2_fx/veil_of_discord_debuff.vpcf'
    }
}