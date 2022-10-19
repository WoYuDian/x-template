
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class fa_li_zhuo_shao_debuff extends BaseModifier {
    primaryStateFactor: number = 0
    damageInterval: number = 0
    caster: CDOTA_BaseNPC
    spellAmplification: number
    ability: CDOTABaseAbility
    OnCreated(params: any): void {
        if(!IsServer()) return;
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
        this.ability = this.GetAbility()
        this.caster = this.ability.GetCaster()
        this.spellAmplification = (this.caster && !this.caster.IsNull())? this.caster.GetSpellAmplification(false): 0;
        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        this.GetParent().ReduceMana(getForceOfRuleLevel('fire', this.caster) * this.primaryStateFactor * (1 + this.spellAmplification))
    }

    IsPurgable(): boolean {
        return false
    }

    IsDebuff(): boolean {
        return true;
    }

    GetEffectName(): string {
        return 'particles/fa_li_zhuo_shao/fa_li_zhuo_shao.vpcf'
    }
}