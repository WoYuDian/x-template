
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fu_shen extends BaseModifier {    
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.GetParent().AddNoDraw()
    }

    OnRefresh(params: object): void {    
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        this.GetParent().RemoveNoDraw()
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.ROOTED]: true,
            [ModifierState.OUT_OF_GAME]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }

    IsHidden(): boolean {
        return true
    }
}