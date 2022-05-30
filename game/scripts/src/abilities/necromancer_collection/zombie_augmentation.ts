import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_zombie_augmentation } from "../../modifiers/necromancer_collection/zombie_augmentation"

@registerAbility()
export class zombie_augmentation extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_zombie_augmentation.name
    }
}