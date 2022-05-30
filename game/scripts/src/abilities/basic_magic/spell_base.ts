import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_spell_base } from "../../modifiers/basic_magic/modifier_spell_base"

@registerAbility()
export class spell_base extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_spell_base.name
    }
}