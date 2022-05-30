import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_base } from "../../modifiers/basic_fitness/modifier_fitness_base"

@registerAbility()
export class fitness_base extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_base.name
    }
}