import { cast_sword_fusion } from "../../abilities/cast/sword/cast_sword_fusion";
import { cast_sword_shot } from "../../abilities/cast/sword/cast_sword_shot";
import { modifier_sword_fusion_buff } from "../../abilities/cast/sword/sword_fusion_buff";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_zhuji } from "../../modifiers/break_buff/modifier_elixir_zhuji"

@registerAbility()
export class item_sword extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    lastTarget: CDOTA_BaseNPC
    OnSpellStart(): void {

        const cursorTarget = this.GetCursorTarget()
        const caster = this.GetCaster()
        if(this.lastTarget && !this.lastTarget.IsNull() && this.lastTarget.HasModifier(modifier_sword_fusion_buff.name)) {
            this.lastTarget.RemoveModifierByName(modifier_sword_fusion_buff.name)
        }
        
        if(cursorTarget && (cursorTarget.GetTeamNumber() == this.GetCaster().GetTeamNumber())) {
            const ability = this.linkedFabao.FindAbilityByName(cast_sword_fusion.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnTarget(cursorTarget, ability, this.GetCaster().GetPlayerOwnerID())
                this.lastTarget = cursorTarget
            }            
        } else {
            const ability = this.linkedFabao.FindAbilityByName(cast_sword_shot.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnPosition(this.GetCursorPosition(), ability, this.GetCaster().GetPlayerOwnerID())
            }
        }
    }
}