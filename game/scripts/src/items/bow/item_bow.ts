import { modifier_bow_armed_buff } from "../../abilities/cast/bow/bow_armed_buff";
import { cast_bow_armed } from "../../abilities/cast/bow/cast_bow_armed";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_zhuji } from "../../modifiers/break_buff/modifier_elixir_zhuji"
import { modifier_out_of_world } from "../../modifiers/common/modifier_out_of_world";

@registerAbility()
export class item_bow extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    lastTarget: CDOTA_BaseNPC
    OnSpellStart(): void {

        const cursorTarget = this.GetCursorTarget()
        const caster = this.GetCaster()
        if(this.lastTarget && !this.lastTarget.IsNull() && this.lastTarget.HasModifier(modifier_bow_armed_buff.name)) {
            this.lastTarget.RemoveModifierByName(modifier_bow_armed_buff.name)
        }

        if(this.linkedFabao && this.linkedFabao.HasModifier(modifier_out_of_world.name)) {
            this.linkedFabao.RemoveModifierByName(modifier_out_of_world.name)
        }
        
        if(cursorTarget && (cursorTarget.GetTeamNumber() == this.GetCaster().GetTeamNumber())) {
            const ability = this.linkedFabao.FindAbilityByName(cast_bow_armed.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnTarget(cursorTarget, ability, this.GetCaster().GetPlayerOwnerID())
                this.lastTarget = cursorTarget
            }            
        } else {
            this.linkedFabao.MoveToPosition(this.GetCursorPosition())
        }
    }
}