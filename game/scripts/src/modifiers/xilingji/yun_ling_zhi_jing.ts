


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { spawnTree } from "../../abilities/xilingji/zhong_ling_shu";
@registerModifier()
export class modifier_yun_ling_zhi_jing extends BaseModifier {
    manaCostPerTick: number = 0
    probabilityFactor: number = 0
    interval: number = 0
    radius: number = 0
    OnCreated(params: any): void {
        this.manaCostPerTick = this.GetAbility().GetSpecialValueFor('mana_cost_per_tick')
        this.probabilityFactor = this.GetAbility().GetSpecialValueFor('probability_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.interval = this.GetAbility().GetSpecialValueFor('interval')
        this.StartIntervalThink(this.interval)
    }

    GetEffectName(): string {
        return 'particles/yun_ling_zhi_jing/yun_ling_zhi_jing.vpcf'
    }

    OnRefresh(params: object): void {
        this.manaCostPerTick = this.GetAbility().GetSpecialValueFor('mana_cost_per_tick')
        this.probabilityFactor = this.GetAbility().GetSpecialValueFor('probability_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.interval = this.GetAbility().GetSpecialValueFor('interval')
    }        

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const forceOfWoodLevel = getForceOfRuleLevel('wood', this.GetAbility().GetCaster())
        
        this.GetParent().ReduceMana(this.manaCostPerTick)

        if(RollPercentage(forceOfWoodLevel * this.probabilityFactor)) {
            const position = RandomVector(this.radius) + this.GetParent().GetAbsOrigin()

            //@ts-ignore
            spawnTree(position, this.GetParent())
        }
    }

    IsPurgable(): boolean {
        return false
    }
}