
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ma_magnetism_debuff extends BaseModifier {
    frameDisplacement: number;
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const frameTime = FrameTime()
        this.frameDisplacement = getFabaoSumOfForceOfRuleLevels(['rock'], caster) * this.GetAbility().GetSpecialValueFor('speed_factor') * frameTime
        this.StartIntervalThink(FrameTime())
    }   

    OnDestroy(): void {
        if(!IsServer()) return;

        FindClearSpaceForUnit(this.GetParent(), this.GetParent().GetAbsOrigin(), false)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        
        const parent = this.GetParent()
        //@ts-ignore
        const direction = (this.GetCaster().GetAbsOrigin() - parent.GetAbsOrigin()).Normalized()
        //@ts-ignore
        parent.SetAbsOrigin(parent.GetAbsOrigin() + (direction * this.frameDisplacement))
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }

    IsDebuff(): boolean {
        return true
    }
}
