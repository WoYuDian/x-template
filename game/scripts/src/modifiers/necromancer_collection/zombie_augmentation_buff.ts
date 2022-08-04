

import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_zombie_augmentation_buff extends BaseModifier {
    damageBonusFactor: number
    healthBonusFactor: number
    forceOfRule: number
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.damageBonusFactor = this.GetAbility().GetSpecialValueFor('damage_bonus_factor')
        this.healthBonusFactor = this.GetAbility().GetSpecialValueFor('health_bonus_factor')
        this.forceOfRule = getForceOfRuleLevel('rock', this.GetAbility().GetCaster()) + getForceOfRuleLevel('spirit', this.GetAbility().GetCaster())
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            damageBonusFactor: this.damageBonusFactor,
            healthBonusFactor: this.healthBonusFactor,
            forceOfRule: this.forceOfRule,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.damageBonusFactor = data.damageBonusFactor
        this.healthBonusFactor = data.healthBonusFactor
        this.forceOfRule = data.forceOfRule
    } 
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.BASEATTACK_BONUSDAMAGE, ModifierFunction.EXTRA_HEALTH_BONUS, ModifierFunction.MAGICAL_RESISTANCE_BONUS]
    }    

    GetModifierBaseAttack_BonusDamage(): number {
        const owner = this.GetAbility().GetOwner()

        if(this.GetParent().GetUnitName() == 'npc_necromance_zombie') {
            if(owner.IsBaseNPC() && owner.IsHero()) {
                return this.damageBonusFactor * this.forceOfRule
            } else {
                return 0
            }
            
        } else {
            return 0;
        }
    }

    GetModifierExtraHealthBonus(): number {
        const owner = this.GetAbility().GetOwner()
        if(this.GetParent().GetUnitName() == 'npc_necromance_zombie') {
            if(owner.IsBaseNPC() && owner.IsHero()) {
                return this.healthBonusFactor * this.forceOfRule
            } else {
                return 0
            }
            
        } else {
            return 0;
        }

    }

    GetModifierMagicalResistanceBonus(event: ModifierAttackEvent): number {
        return 50
    }

    IsHidden(): boolean {
        return this.GetParent().GetUnitName() != 'npc_necromance_zombie'
    }

}