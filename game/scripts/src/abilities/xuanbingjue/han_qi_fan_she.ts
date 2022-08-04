import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_han_qi_fan_she } from "../../modifiers/xuanbingjue/han_qi_fan_she"

@registerAbility()
export class han_qi_fan_she extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_han_qi_fan_she.name
    }
}