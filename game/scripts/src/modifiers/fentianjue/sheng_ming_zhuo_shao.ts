
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { sheng_ming_zhuo_shao_debuff } from "./sheng_ming_zhuo_shao_debuff";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_sheng_ming_zhuo_shao extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }
    
    
    OnTakeDamage(params: ModifierInstanceEvent): number {
        if(!IsServer()) return;        
        if(params.attacker != this.GetParent()) return;
        if(params.unit == this.GetParent()) return;
        if(params.unit.IsBuilding()) return;
        if(params.inflictor == this.GetAbility()) return
        if(params.unit.GetTeamNumber() == params.attacker.GetTeamNumber()) return;

        if (params.damage_type == DamageTypes.MAGICAL) {
            const debuff = params.unit.FindModifierByName(sheng_ming_zhuo_shao_debuff.name)
            if(!debuff) {
                params.unit.AddNewModifier(params.attacker, this.GetAbility(), sheng_ming_zhuo_shao_debuff.name,
                    {duration: this.GetAbility().GetSpecialValueFor('duration_factor') * getForceOfRuleLevel('fire', params.attacker)})               
            } else {
                debuff.SetDuration(this.GetAbility().GetSpecialValueFor('duration_factor') * getForceOfRuleLevel('fire', params.attacker), true)
            }
        }
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true;
    }
}