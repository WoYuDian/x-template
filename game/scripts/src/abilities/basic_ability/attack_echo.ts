import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_attack_echo } from "../../modifiers/basic_ability/modifier_attack_echo"

@registerAbility()
export class attack_echo extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_attack_echo.name
    }
}