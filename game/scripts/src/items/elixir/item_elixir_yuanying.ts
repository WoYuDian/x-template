import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_elixir_yuanying } from "../../modifiers/break_buff/modifier_elixir_yuanying"

@registerAbility()
export class item_elixir_yuanying extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC() && owner.IsHero()) {
            const buffZhuji = owner.FindModifierByName(modifier_elixir_yuanying.name)

            if(buffZhuji) {
                const curCount = buffZhuji.GetStackCount();

                buffZhuji.SetStackCount(((curCount + 20) > 100)? 100: (curCount + 20))
            } else {
                owner.AddNewModifier(owner, this, modifier_elixir_yuanying.name, {percentage: 20})
            }

            this.SpendCharge()
        }
    }
}