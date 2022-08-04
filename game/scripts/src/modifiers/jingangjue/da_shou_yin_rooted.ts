
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_da_shou_yin_rooted extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.ROOTED]: true
        }
    }

    IsDebuff(): boolean {
        return true;
    }

    IsPurgable(): boolean {
        return false
    }
}