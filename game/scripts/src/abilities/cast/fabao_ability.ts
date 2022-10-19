import { getUnitFirstItem } from "../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
@registerAbility()
export class fabao_ability extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return

        this.SetLevel(1)
    }
}
