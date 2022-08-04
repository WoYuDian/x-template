import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_lei_tin_zhen_ji } from "../../modifiers/yuleizhenjing/lei_tin_zhen_ji"

@registerAbility()
export class lei_tin_zhen_ji extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_lei_tin_zhen_ji.name
    }
}