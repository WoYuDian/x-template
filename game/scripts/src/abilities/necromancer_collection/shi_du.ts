import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_du } from "../../modifiers/necromancer_collection/shi_du"

@registerAbility()
export class shi_du extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_shi_du.name
    }
}