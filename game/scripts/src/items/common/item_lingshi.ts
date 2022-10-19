import { onMoneyChanged } from "../../event_handlers/system_events";
import { BaseItem, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class item_lingshi extends BaseItem
{
    OnSpellStart(): void {
        if(!IsServer()) return;
        
        //@ts-ignore
        if(!this.params) {       
            this.SpendCharge()
            return;
        }
        //@ts-ignore
        const params = this.params

        let amount = 1;
        if(params.max && params.min) {            
            amount = RandomInt(params.min || 1, params.max || 1)
        } else if (params.amount) {
            amount = params.amount
        }

        if(params.bonusParams) {
            if(params.bonusPrams.scale) {
                amount = Math.ceil(params.bonusParams.scale * amount)
            }
        }
        
        const playerId = this.GetCaster().GetPlayerOwnerID()
        PlayerResource.ModifyGold(playerId, amount, true, ModifyGoldReason.CREEP_KILL)
        onMoneyChanged({PlayerID: playerId})

        this.SpendCharge()
    }
}