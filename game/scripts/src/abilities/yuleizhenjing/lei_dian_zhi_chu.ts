import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_lei_dian_zhi_chu } from "../../modifiers/yuleizhenjing/lei_dian_zhi_chu"

@registerAbility()
export class lei_dian_zhi_chu extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_lei_dian_zhi_chu.name
    }
}
