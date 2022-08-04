import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_ji_sheng } from "../../modifiers/xilingji/ji_sheng"

@registerAbility()
export class ji_sheng extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_ji_sheng.name
    }
}