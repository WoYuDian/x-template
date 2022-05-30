import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_enhancement } from "../../modifiers/basic_fitness/modifier_fitness_enhancement"

@registerAbility()
export class fitness_enhancement extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_enhancement.name
    }
}