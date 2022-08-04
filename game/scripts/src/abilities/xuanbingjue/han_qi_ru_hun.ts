import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_han_qi_ru_hun } from "../../modifiers/xuanbingjue/han_qi_ru_hun"

@registerAbility()
export class han_qi_ru_hun extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_han_qi_ru_hun.name
    }
}