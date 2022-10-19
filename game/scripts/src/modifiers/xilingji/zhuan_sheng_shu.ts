
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_fu_su_bound } from "./fu_su_bound";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { Timers } from "../../lib/timers";
import { respawnHero } from "../../game_logic/game_operation";
@registerModifier()
export class modifier_zhuan_sheng_shu extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {        
        if(!IsServer()) return;
        if(event.attacker == this.GetParent()) return;
        if(event.unit != this.GetParent()) return;

        const ability = this.GetAbility()
        if(ability.IsCooldownReady()) {
            const units = FindUnitsInRadius(
                this.GetParent().GetTeamNumber(), 
                this.GetParent().GetAbsOrigin(), 
                null, 
                ability.GetSpecialValueFor('radius'), 
                UnitTargetTeam.FRIENDLY, 
                UnitTargetType.ALL, 
                UnitTargetFlags.NONE, 
                FindOrder.ANY, 
                false)

            let tree: CDOTA_BaseNPC;
            for(const unit of units) {            
                if(unit.GetUnitName() != 'zhong_ling_shu_tree') continue;
    
                tree = unit;
                break;
            }

            if(tree) {
                const parent = this.GetParent()

                if(parent.IsHero()) {
                    tree.AddNewModifier(parent, this.GetAbility(), modifier_fu_su_bound.name, {duration: ability.GetSpecialValueFor('delay')})
                    Timers.CreateTimer(ability.GetSpecialValueFor('delay'), (function() {                        
                        if(!tree || tree.IsNull()) return;
                        parent.SetRespawnPosition(tree.GetAbsOrigin())
                        respawnHero(parent)
                        tree.Kill(ability, this.GetParent())
                        ability.StartCooldown(ability.GetSpecialValueFor('base_cold_down') - (getForceOfRuleLevel('wood', this.GetCaster()) * ability.GetSpecialValueFor('cold_down_reduction_factor')))
                    }).bind(this))                   
                }
            }
        }
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}