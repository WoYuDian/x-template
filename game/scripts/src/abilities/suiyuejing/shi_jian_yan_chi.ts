import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_yan_chi } from "../../modifiers/suiyuejing/shi_jian_yan_chi"

@registerAbility()
export class shi_jian_yan_chi extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_shi_jian_yan_chi.name
    }
}