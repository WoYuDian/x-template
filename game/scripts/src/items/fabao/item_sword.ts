import { cast_sword_fusion } from "../../abilities/cast/sword/cast_sword_fusion";
import { cast_sword_shot } from "../../abilities/cast/sword/cast_sword_shot";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_zhuji } from "../../modifiers/break_buff/modifier_elixir_zhuji"

@registerAbility()
export class item_sword extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    OnSpellStart(): void {

        const cursorTarget = this.GetCursorTarget()
        if(cursorTarget && (cursorTarget.GetTeamNumber() == this.GetCaster().GetTeamNumber())) {
            const ability = this.linkedFabao.FindAbilityByName(cast_sword_fusion.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnTarget(cursorTarget, ability, this.GetCaster().GetPlayerOwnerID())
            }            
        } else {
            const ability = this.linkedFabao.FindAbilityByName(cast_sword_shot.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnPosition(this.GetCursorPosition(), ability, this.GetCaster().GetPlayerOwnerID())
            }
        }
    }
}