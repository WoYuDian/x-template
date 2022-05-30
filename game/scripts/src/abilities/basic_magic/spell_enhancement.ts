import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_spell_enhancement } from "../../modifiers/basic_magic/modifier_spell_enhancement"

@registerAbility()
export class spell_enhancement extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_spell_enhancement.name
    }
}