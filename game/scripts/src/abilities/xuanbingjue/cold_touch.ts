import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_cold_touch } from "../../modifiers/xuanbingjue/cold_touch"

@registerAbility()
export class cold_touch extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_cold_touch.name
    }
}