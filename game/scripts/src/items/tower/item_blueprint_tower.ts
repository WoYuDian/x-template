import { modifier_tower_attributes } from "../../abilities/cast/tower/tower_attributes";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { item_blueprint } from "../item_blueprint";

@registerAbility()
export class item_blueprint_tower extends item_blueprint
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()
        print(owner.GetName())
        
        if(owner.IsBaseNPC() && (owner.GetUnitName() == 'fabao_embryo') && this.canUseBluePrint()) {
            const abilities = ['cast_tower_root', 'cast_tower_shell']

            for(const ability of abilities) {
                if(!owner.HasAbility(ability)) {
                    owner.AddAbility(ability)
                }
            }

            this.SpendCharge()
            owner.AddNewModifier(owner, this, modifier_tower_attributes.name, {})
        }
    }
}