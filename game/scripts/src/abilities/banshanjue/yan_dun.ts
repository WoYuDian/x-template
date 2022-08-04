import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_yan_dun } from "../../modifiers/banshanjue/yan_dun"

@registerAbility()
export class yan_dun extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_yan_dun.name
    }
}