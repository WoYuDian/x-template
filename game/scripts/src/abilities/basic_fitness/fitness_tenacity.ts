import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_tenacity } from "../../modifiers/basic_fitness/modifier_fitness_tenacity"

@registerAbility()
export class fitness_tenacity extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_tenacity.name
    }
}