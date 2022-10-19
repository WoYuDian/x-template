import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_lifesteal } from "./modifier_ma_lifesteal";
@registerAbility()
export class ma_lifesteal extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }

    GetIntrinsicModifierName(): string {
        return modifier_ma_lifesteal.name
    }
}

