import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_artisan_base } from "../../modifiers/basic_ability/modifier_artisan_base"

@registerAbility()
export class artisan_base extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_artisan_base.name
    }
}