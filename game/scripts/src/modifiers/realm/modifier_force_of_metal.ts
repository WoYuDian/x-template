
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_force_of_metal extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(params.bonus || 0)
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP]
    }

    OnTooltip(): number {
        return this.GetStackCount()           
    }

    RemoveOnDeath(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false
    }

    GetTexture(): string {
        return 'mars_bulwark'
    }
}