import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_jindan } from "../../modifiers/break_buff/modifier_elixir_jindan"

@registerAbility()
export class item_perfect_stone extends BaseItem
{
    Spawn(): void {
    }
}