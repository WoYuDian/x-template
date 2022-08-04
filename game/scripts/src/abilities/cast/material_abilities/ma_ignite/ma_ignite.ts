import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_ignite } from "./modifier_ma_ignite";

@registerAbility()
export class ma_ignite extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }
    GetIntrinsicModifierName(): string {
        return modifier_ma_ignite.name
    }
}

