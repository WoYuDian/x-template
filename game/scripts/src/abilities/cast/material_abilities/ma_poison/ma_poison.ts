import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_poison } from "./modifier_ma_poison";
@registerAbility()
export class ma_poison extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }
    GetIntrinsicModifierName(): string {
        return modifier_ma_poison.name
    }
}

