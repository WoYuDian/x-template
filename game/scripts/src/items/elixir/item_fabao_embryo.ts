import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fabao_common } from "../../modifiers/fabao/modifier_fabao_common";

@registerAbility()
export class item_fabao_embryo extends BaseItem
{
    unit: CDOTA_BaseNPC
    OnSpellStart(): void {
        if(!IsServer()) return;
        const owner = this.GetOwner()

        
        if(owner.IsBaseNPC() && owner.IsHero()) {
            print(this.unit,'+++++++++++')
            if(!this.unit) {
                //@ts-ignore
                this.unit = CreateUnitByName('fabao_embryo', owner.GetAbsOrigin() + RandomVector(200) + Vector(0, 0, 1000), true, owner, owner, owner.GetTeam())
                this.unit.SetControllableByPlayer(owner.GetPlayerID(), false);
                this.unit.AddNewModifier(this.GetCaster(), this, modifier_fabao_common.name, {}) 
            }

            
        }
    }
}