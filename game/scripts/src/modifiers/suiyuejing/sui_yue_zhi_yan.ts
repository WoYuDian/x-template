
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { forceOfRuleMap, getRuleNamesOfUnit, getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_sui_yue_zhi_yan extends BaseModifier {
    damageFactor: number
    damageInterval: number
    forceOfRule: number
    forceOfRuleReductionFactor: number
    ruleNames: string[]
    reductionMap: {}
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.forceOfRule = getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], this.GetCaster())
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.forceOfRuleReductionFactor = this.GetAbility().GetSpecialValueFor('force_of_rule_reduction_factor')
        this.ruleNames = getRuleNamesOfUnit(this.GetParent())
        this.reductionMap = {}
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()

        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        // this.OnCreated({})
        // this.SendBuffRefreshToClients()
    }

    OnDestroy(): void {
        if(!IsServer()) return
        const parent = this.GetParent()
        for(const rule of this.ruleNames) {
            const buff = parent.FindModifierByName(forceOfRuleMap[rule].name);

            if(buff) {
                buff.SetStackCount(buff.GetStackCount() + (this.reductionMap[rule] || 0))
            }
        }
    }

    // AddCustomTransmitterData() {
    //     return {
    //         damageFactor: this.damageFactor,
    //         forceOfRule: this.forceOfRule,
    //         damageInterval: this.damageInterval,
    //     }
    // }

    // HandleCustomTransmitterData(data) {        
    //     this.damageFactor = data.damageFactor
    //     this.forceOfRule = data.forceOfRule
    //     this.damageInterval = data.damageInterval
    // }   

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const parent = this.GetParent()
        const damage = this.damageFactor * this.forceOfRule

        ApplyDamage({
            victim: parent,
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            ability: this.GetAbility()
        })

        if(this.ruleNames.length < 1) return;
        const forceOfRuleReduction = Math.floor(this.forceOfRuleReductionFactor * this.forceOfRule / this.ruleNames.length)
        if(forceOfRuleReduction < 1) return;
        for(const rule of this.ruleNames) {
            const buff = parent.FindModifierByName(forceOfRuleMap[rule].name)

            if(!this.reductionMap[rule]) {
                this.reductionMap[rule] = 0
            }

            if(buff && buff.GetStackCount() > 0) {
                const curStack = buff.GetStackCount()
                
                if(curStack < forceOfRuleReduction) {
                    this.reductionMap[rule] += curStack
                    buff.SetStackCount(0)
                } else {
                    this.reductionMap[rule] += forceOfRuleReduction
                    buff.SetStackCount(curStack - forceOfRuleReduction)
                }
         
            }
        }
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_phoenix/phoenix_fire_spirit_burn.vpcf'
    }

    IsPurgable(): boolean {
        return false
    }
}