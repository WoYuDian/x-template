

import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_zombie_augmentation_buff extends BaseModifier {
    damageBonusFactor: number
    healthBonusFactor: number
    OnCreated(params: object): void {
        this.damageBonusFactor = this.GetAbility().GetSpecialValueFor('damage_bonus_factor')
        this.healthBonusFactor = this.GetAbility().GetSpecialValueFor('health_bonus_factor')
    }

    OnRefresh(params: object): void {
        this.damageBonusFactor = this.GetAbility().GetSpecialValueFor('damage_bonus_factor')
        this.healthBonusFactor = this.GetAbility().GetSpecialValueFor('health_bonus_factor')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.BASEATTACK_BONUSDAMAGE, ModifierFunction.EXTRA_HEALTH_BONUS]
    }    

    GetModifierBaseAttack_BonusDamage(): number {
        const owner = this.GetAbility().GetOwner()

        if(this.GetParent().GetUnitName() == 'npc_necromance_zombie') {
            if(owner.IsBaseNPC() && owner.IsHero()) {
                return this.damageBonusFactor * owner.GetPrimaryStatValue()
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
                return this.healthBonusFactor * owner.GetPrimaryStatValue()
            } else {
                return 0
            }
            
        } else {
            return 0;
        }

    }

    IsHidden(): boolean {
        return this.GetParent().GetUnitName() != 'npc_necromance_zombie'
    }

}