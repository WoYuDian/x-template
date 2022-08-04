import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fu_shen } from "../../modifiers/necromancer_collection/fu_shen";
import { modifier_fu_shen_buff } from "../../modifiers/necromancer_collection/fu_shen_buff";
import { li_ti } from "./li_ti";
@registerAbility()
export class fu_shen extends BaseAbility
{    
    curTarget: CDOTA_BaseNPC
    OnSpellStart(): void {                
        // if(IsServer()) {
        const target = this.GetCursorTarget();

        const caster = this.GetCaster()

        if((target && target.IsBaseNPC() && (target.GetTeam() == caster.GetTeam())) || this.curTarget)  {

            const fuShen = caster.FindModifierByName(modifier_fu_shen.name)
            const fuShenBuff = target.FindModifierByName(modifier_fu_shen_buff.name)
            if(fuShenBuff || fuShen) {
                caster.RemoveModifierByName(modifier_fu_shen.name)                
                if(this.curTarget) {
                    this.curTarget.RemoveModifierByName(modifier_fu_shen_buff.name)
                    this.curTarget = null
                }
            }

            caster.AddNewModifier(caster, this, modifier_fu_shen.name, {})
            target.AddNewModifier(caster, this, modifier_fu_shen_buff.name, {})
            this.curTarget = target
            if(!target.FindAbilityByName(li_ti.name)) {
                const liti = target.AddAbility(li_ti.name)
                liti.UpgradeAbility(false)
            }            
        }
    }

    IsHidden(): boolean {
        return false
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }
}