import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"

@registerAbility()
export class sword_mean_stacking extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_sword_mean_stacking.name
    }
}