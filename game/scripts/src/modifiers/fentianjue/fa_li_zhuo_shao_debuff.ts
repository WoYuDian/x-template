
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class fa_li_zhuo_shao_debuff extends BaseModifier {
    primaryStateFactor: number = 0
    damageInterval: number = 0

    OnCreated(params: any): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor');
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval');
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        const caster = this.GetAbility().GetCaster()    
        this.GetParent().ReduceMana(getForceOfRuleLevel('fire', caster) * this.primaryStateFactor * (1 + caster.GetSpellAmplification(false)))
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