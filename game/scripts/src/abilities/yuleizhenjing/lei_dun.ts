import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_lei_dun } from "../../modifiers/yuleizhenjing/lei_dun"

@registerAbility()
export class lei_dun extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_lei_dun.name
    }
}
