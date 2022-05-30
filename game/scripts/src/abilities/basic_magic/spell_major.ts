import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_spell_major } from "../../modifiers/basic_magic/modifier_spell_major"

@registerAbility()
export class spell_major extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_spell_major.name
    }
}