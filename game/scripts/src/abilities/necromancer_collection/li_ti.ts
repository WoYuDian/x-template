import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fu_shen } from "../../modifiers/necromancer_collection/fu_shen";
import { modifier_fu_shen_buff } from "../../modifiers/necromancer_collection/fu_shen_buff";
@registerAbility()
export class li_ti extends BaseAbility
{    
    curTarget: CDOTA_BaseNPC
    OnSpellStart(): void {                    
        const caster = this.GetCaster()
        const fuShenBuff = caster.FindModifierByName(modifier_fu_shen_buff.name)

        if(!fuShenBuff) return

        fuShenBuff.GetCaster().RemoveModifierByName(modifier_fu_shen.name)
        caster.RemoveModifierByName(modifier_fu_shen_buff.name)
        caster.RemoveAbility(li_ti.name)
    }
    
    IsHidden(): boolean {
        return false
    }
}