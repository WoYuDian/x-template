import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_zhuo_mu } from "../../modifiers/fentianjue/zhuo_mu"

@registerAbility()
export class zhuo_mu extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_zhuo_mu.name
    }
}