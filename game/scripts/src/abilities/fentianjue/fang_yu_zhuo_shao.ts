import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fang_yu_zhuo_shao } from "../../modifiers/fentianjue/fang_yu_zhuo_shao"

@registerAbility()
export class fang_yu_zhuo_shao extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fang_yu_zhuo_shao.name
    }
}