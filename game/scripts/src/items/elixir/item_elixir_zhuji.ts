import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_zhuji } from "../../modifiers/break_buff/modifier_elixir_zhuji"

@registerAbility()
export class item_elixir_zhuji extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC() && owner.IsHero()) {
            const buffZhuji = owner.FindModifierByName(modifier_elixir_zhuji.name)

            if(buffZhuji) {
                const curCount = buffZhuji.GetStackCount();

                buffZhuji.SetStackCount(((curCount + 100) > 100)? 100: (curCount + 100))
            } else {
                owner.AddNewModifier(owner, this, modifier_elixir_zhuji.name, {percentage: 100})
            }

            this.SpendCharge()
        }
    }
}