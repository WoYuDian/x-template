
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_zombie_augmentation_buff } from "./zombie_augmentation_buff"; 

@registerModifier()
export class modifier_zombie_augmentation extends BaseModifier {
    damageBonusFactor: number
    healthBonus: number
    OnCreated(params: object): void {
        this.damageBonusFactor = this.GetAbility().GetSpecialValueFor('damage_bonus_factor')
        this.healthBonus = this.GetAbility().GetSpecialValueFor('health_bonus')   
    }

    OnRefresh(params: object): void {
        this.damageBonusFactor = this.GetAbility().GetSpecialValueFor('damage_bonus_factor')
        this.healthBonus = this.GetAbility().GetSpecialValueFor('health_bonus')
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return 1000;
    }

    GetModifierAura(): string {
        return modifier_zombie_augmentation_buff.name
    }

    IsHidden(): boolean {
        return true
    }
}