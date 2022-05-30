import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_major } from "../../modifiers/basic_fitness/modifier_fitness_major"

@registerAbility()
export class fitness_major extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_major.name
    }
}