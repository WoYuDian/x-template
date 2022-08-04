
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()

export class modifier_out_of_world extends BaseModifier {
    destination: Vector = null
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().AddNoDraw()
        if(params.dest_x) {
            this.destination = Vector(params.dest_x, params.dest_y, params.dest_z)
        }

    }

    OnDestroy(): void {
        if(!IsServer()) return;

        this.GetParent().RemoveNoDraw()
        if(this.destination) {
            this.GetParent().SetAbsOrigin(this.destination)
        }
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.OUT_OF_GAME]: true,
            [ModifierState.ROOTED]: true,
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }
}