import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fitness_master } from "../../modifiers/basic_fitness/modifier_fitness_master"

@registerAbility()
export class fitness_master extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_fitness_master.name
    }
}