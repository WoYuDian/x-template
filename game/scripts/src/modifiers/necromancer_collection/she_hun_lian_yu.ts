
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_she_hun_lian_yu_debuff } from "./she_hun_lian_yu_debuff";

@registerModifier()
export class modifier_she_hun_lian_yu extends BaseModifier {
    succeed: boolean = false
    damageInterval: number = 0
    manaCostPerWave: number = 0
    searchRadius: number = 0
    OnCreated(params: object): void {
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')
    }

    OnRefresh(params: object): void {
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')
    }

    spellSucceed() {
        this.succeed = true;

        this.StartIntervalThink(this.damageInterval)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        if(this.manaCostPerWave > this.GetParent().GetMana()) {
            this.GetParent().RemoveModifierByName(modifier_she_hun_lian_yu.name)
            return;
        } else {
            this.GetParent().ReduceMana(this.manaCostPerWave)
        }
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.BASIC + UnitTargetType.HERO
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('search_radius');
    }

    GetModifierAura(): string {
        return modifier_she_hun_lian_yu_debuff.name
    }

    GetEffectName(): string {
        return 'particles/econ/items/necrolyte/necro_ti9_immortal/necro_ti9_immortal_shroud.vpcf'
    }
}