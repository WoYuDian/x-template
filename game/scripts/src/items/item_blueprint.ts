import { BaseItem, registerAbility } from "../lib/dota_ts_adapter"

@registerAbility()
export class item_blueprint extends BaseItem
{
    canUseBluePrint() {
        const owner = this.GetOwner()

        //@ts-ignore
        if(owner.usedBluePrint) {            
            return false;
        } else {
            //@ts-ignore
            owner.usedBluePrint = true;
            return true;
        }
    }
}