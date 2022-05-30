import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_witchcraft_base } from "../../modifiers/basic_ability/modifier_witchcraft_base"

@registerAbility()
export class witchcraft_base extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_witchcraft_base.name
    }
}