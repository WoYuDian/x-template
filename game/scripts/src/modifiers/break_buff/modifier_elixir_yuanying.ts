
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_elixir_yuanying extends BaseModifier {
    OnCreated(params: any): void {
        if(!IsServer()) return;
        this.SetStackCount(params.percentage || 0)
    }

    OnRefresh(params: object): void {
    }

    GetTexture(): string {
        return 'item_elixir_yuanying'
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false;
    }
}