import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_regen } from "../../modifiers/basic_fitness/modifier_fitness_regen"

@registerAbility()
export class fitness_regen extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_regen.name
    }
}