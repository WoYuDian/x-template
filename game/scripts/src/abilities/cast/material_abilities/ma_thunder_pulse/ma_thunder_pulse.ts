import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_thunder_pulse } from "./modifier_ma_thunder_pulse";
@registerAbility()
export class ma_thunder_pulse extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }
    GetIntrinsicModifierName(): string {
        return modifier_ma_thunder_pulse.name
    }
}

