import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_spell_master } from "../../modifiers/basic_magic/modifier_spell_master"

@registerAbility()
export class spell_master extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_spell_master.name
    }
}