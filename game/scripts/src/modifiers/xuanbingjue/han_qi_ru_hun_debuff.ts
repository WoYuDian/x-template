
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class han_qi_ru_hun_debuff extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(1)
    }

    OnRefresh(params: object): void {
    }
   

    IsPurgable(): boolean {
        return false
    }

    OnTooltip(): number {
        return this.GetStackCount()           
    }
}