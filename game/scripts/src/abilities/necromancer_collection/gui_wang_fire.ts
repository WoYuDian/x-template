import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_gui_wang_fire } from "../../modifiers/necromancer_collection/gui_wang_fire"

@registerAbility()
export class gui_wang_fire extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_gui_wang_fire.name
    }
}