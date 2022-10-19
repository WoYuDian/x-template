import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_magnetism } from "./modifier_ma_magnetism";
@registerAbility()
export class ma_magnetism extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }

    GetIntrinsicModifierName(): string {
        return modifier_ma_magnetism.name
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('aura_radius')
    }
}

