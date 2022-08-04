import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sheng_ming_lian_jie } from "../../modifiers/xilingji/sheng_ming_lian_jie"

@registerAbility()
export class sheng_ming_lian_jie extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_sheng_ming_lian_jie.name
    }
}