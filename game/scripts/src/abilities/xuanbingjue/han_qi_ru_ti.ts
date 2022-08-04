import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_han_qi_ru_ti } from "../../modifiers/xuanbingjue/han_qi_ru_ti"

@registerAbility()
export class han_qi_ru_ti extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_han_qi_ru_ti.name
    }
}
