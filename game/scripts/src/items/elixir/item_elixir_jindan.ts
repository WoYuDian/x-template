import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_jindan } from "../../modifiers/break_buff/modifier_elixir_jindan"

@registerAbility()
export class item_elixir_jindan extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC() && owner.IsHero()) {
            const buffZhuji = owner.FindModifierByName(modifier_elixir_jindan.name)

            if(buffZhuji) {
                const curCount = buffZhuji.GetStackCount();

                buffZhuji.SetStackCount(((curCount + 30) > 100)? 100: (curCount + 30))
            } else {
                owner.AddNewModifier(owner, this, modifier_elixir_jindan.name, {percentage: 30})
            }

            this.SpendCharge()
        }
    }
}