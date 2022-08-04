import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_zhong_li_chang } from "../../modifiers/banshanjue/zhong_li_chang" 

@registerAbility()
export class zhong_li_chang extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_zhong_li_chang.name
    }
}