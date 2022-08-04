import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_lei_dian_chang } from "../../modifiers/yuleizhenjing/lei_dian_chang"

@registerAbility()
export class lei_dian_chang extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_lei_dian_chang.name
    }
}