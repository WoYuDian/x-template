import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_resentment_stacking } from "../../modifiers/necromancer_collection/resentment_stacking"

@registerAbility()
export class resentment_stacking extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_resentment_stacking.name
    }
}