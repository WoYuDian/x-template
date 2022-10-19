import { cast_shield_armed } from "../../abilities/cast/shield/cast_shield_armed";
import { modifier_shield_armed_buff } from "../../abilities/cast/shield/shield_armed_buff";
import { cast_tower_suppress } from "../../abilities/cast/tower/cast_tower_suppress";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_out_of_world } from "../../modifiers/common/modifier_out_of_world";
@registerAbility()
export class item_shield extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    lastTarget: CDOTA_BaseNPC
    OnSpellStart(): void {

        const cursorTarget = this.GetCursorTarget()
        const caster = this.GetCaster()
        if(this.lastTarget && !this.lastTarget.IsNull() && this.lastTarget.HasModifier(modifier_shield_armed_buff.name)) {
            this.lastTarget.RemoveModifierByName(modifier_shield_armed_buff.name)
        }

        if(this.linkedFabao && this.linkedFabao.HasModifier(modifier_out_of_world.name)) {
            this.linkedFabao.RemoveModifierByName(modifier_out_of_world.name)
        }
        
        if(cursorTarget && (cursorTarget.GetTeamNumber() == this.GetCaster().GetTeamNumber())) {
            const ability = this.linkedFabao.FindAbilityByName(cast_shield_armed.name)
            if(ability) {
                this.linkedFabao.CastAbilityOnTarget(cursorTarget, ability, this.GetCaster().GetPlayerOwnerID())
                this.lastTarget = cursorTarget
            }            
        } else {
            this.linkedFabao.MoveToPosition(this.GetCursorPosition())
        }
    }
}