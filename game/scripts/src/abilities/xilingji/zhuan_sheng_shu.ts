import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_zhuan_sheng_shu } from "../../modifiers/xilingji/zhuan_sheng_shu"

@registerAbility()
export class zhuan_sheng_shu extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_zhuan_sheng_shu.name
    }

}