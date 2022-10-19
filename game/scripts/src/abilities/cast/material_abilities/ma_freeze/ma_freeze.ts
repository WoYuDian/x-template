import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_freeze } from "./modifier_ma_freeze";

@registerAbility()
export class ma_freeze extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }
    GetIntrinsicModifierName(): string {
        return modifier_ma_freeze.name
    }
}

