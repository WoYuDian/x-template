import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_mean_accelerate } from "../../modifiers/swordmanship/sword_mean_accelerate"

@registerAbility()
export class sword_mean_accelerate extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_sword_mean_accelerate.name
    }
}