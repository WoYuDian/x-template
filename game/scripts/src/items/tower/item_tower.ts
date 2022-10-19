import { cast_tower_suppress } from "../../abilities/cast/tower/cast_tower_suppress";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class item_tower extends BaseItem
{
    linkedFabao: CDOTA_BaseNPC
    OnSpellStart(): void {

        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        const ability = this.linkedFabao.FindAbilityByName(cast_tower_suppress.name)

        if(ability && ability.IsCooldownReady()) {
            this.linkedFabao.CastAbilityOnPosition(vPos, ability, this.GetCaster().GetPlayerOwnerID())
        } else {
            this.linkedFabao.MoveToPosition(vPos)
        }        
    }
}