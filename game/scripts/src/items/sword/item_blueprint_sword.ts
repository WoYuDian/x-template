import { modifier_sword_attributes } from "../../abilities/cast/sword/sword_attributes";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class item_blueprint_sword extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()
        print(owner.GetName())
        
        if(owner.IsBaseNPC() && (owner.GetUnitName() == 'fabao_embryo')) {
            const abilities = ['cast_sword_hilt', 'cast_sword_blade']

            for(const ability of abilities) {
                if(!owner.HasAbility(ability)) {
                    owner.AddAbility(ability)
                }
            }

            this.SpendCharge()
            owner.AddNewModifier(owner, this, modifier_sword_attributes.name, {})
        }
    }
}