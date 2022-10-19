import { modifier_bow_armed_buff } from "../../abilities/cast/bow/bow_armed_buff";
import { cast_bow_armed } from "../../abilities/cast/bow/cast_bow_armed";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_zhuji } from "../../modifiers/break_buff/modifier_elixir_zhuji"
import { modifier_out_of_world } from "../../modifiers/common/modifier_out_of_world";

@registerAbility()
export class item_banner extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    OnSpellStart(): void {

        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        this.linkedFabao.MoveToPosition(vPos)
    }
}