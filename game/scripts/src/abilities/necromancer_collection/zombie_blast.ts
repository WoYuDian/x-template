import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_zombie_blast } from "../../modifiers/necromancer_collection/zombie_blast"

@registerAbility()
export class zombie_blast extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_zombie_blast.name
    }
}