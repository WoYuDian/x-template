import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_spell_accelerate } from "../../modifiers/basic_magic/modifier_spell_accelerate"

@registerAbility()
export class spell_accelerate extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_spell_accelerate.name
    }
}