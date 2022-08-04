import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fabao_common } from "../../modifiers/fabao/modifier_fabao_common";

@registerAbility()
export class item_fabao_embryo extends BaseItem
{
    unit: CDOTA_BaseNPC
    OnSpellStart(): void {
        const owner = this.GetOwner()        
        
        if(owner.IsBaseNPC() && owner.IsHero()) {
            if(!this.unit) {
                //@ts-ignore
                this.unit = CreateUnitByName('fabao_embryo', owner.GetAbsOrigin() + RandomVector(200), true, owner, owner, owner.GetTeamNumber()) 
                this.unit.SetControllableByPlayer(owner.GetPlayerID(), false);
                const buff = this.unit.AddNewModifier(owner, this, modifier_fabao_common.name, {}) as modifier_fabao_common
                buff.setOwner(owner)
            }            
        }
    }
}