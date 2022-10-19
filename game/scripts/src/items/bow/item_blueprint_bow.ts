import { modifier_bow_attributes } from "../../abilities/cast/bow/bow_attributes";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { item_blueprint } from "../item_blueprint";

@registerAbility()
export class item_blueprint_bow extends item_blueprint
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()
        print(owner.GetName())
        
        if(owner.IsBaseNPC() && (owner.GetUnitName() == 'fabao_embryo') && this.canUseBluePrint()) {
            const abilities = ['cast_bow_bow', 'cast_bow_bowstring']

            for(const ability of abilities) {
                if(!owner.HasAbility(ability)) {
                    owner.AddAbility(ability)
                }
            }

            this.SpendCharge()
            owner.AddNewModifier(owner, this, modifier_bow_attributes.name, {})
        }
    }
}