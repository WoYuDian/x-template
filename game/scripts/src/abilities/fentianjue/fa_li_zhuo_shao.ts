import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fa_li_zhuo_shao } from "../../modifiers/fentianjue/fa_li_zhuo_shao"

@registerAbility()
export class fa_li_zhuo_shao extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fa_li_zhuo_shao.name
    }
}