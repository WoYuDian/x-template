import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_dodge } from "../../modifiers/basic_fitness/modifier_fitness_dodge"

@registerAbility()
export class fitness_dodge extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_dodge.name
    }
}