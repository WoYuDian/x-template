import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_ji_han_zhi_qi } from "../../modifiers/xuanbingjue/ji_han_zhi_qi"

@registerAbility()
export class ji_han_zhi_qi extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_ji_han_zhi_qi.name
    }
}