import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_charges extends BaseModifier {
    kv: any
    Update() {
        if(this.GetDuration() == -1) {
            this.SetDuration(this.kv.replenish_time, true)
            this.StartIntervalThink(this.kv.replenish_time)
        }

        if(this.GetStackCount() == 0) {
            this.GetAbility().StartCooldown(this.GetRemainingTime())
        }
    }

    OnCreated(params: any): void {
        this.SetStackCount(5)
        this.kv = params;

        if(params.start_count && params.start_count != params.max_count) {
            this.Update()
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ABILITY_EXECUTED]
    }

    OnAbilityExecuted(event: ModifierAbilityEvent): void {
        if(event.unit == this.GetParent()) {
            const ability = event.ability

            if(event.ability == this.GetAbility()) {
                this.DecrementStackCount()
                this.Update()
            }
        }
    }

    OnIntervalThink(): void {
        const stack = this.GetStackCount()

        if(stack < this.kv.max_count) {
            this.SetDuration(this.kv.replenish_time, true)
            this.IncrementStackCount()

            if(stack == this.kv.max_count - 1)  {
                this.SetDuration(-1, true)
                this.StartIntervalThink(-1)
            }
        }
    }

    DestroyOnExpire(): boolean {
        return false;
    }

    IsPurgable(): boolean {
        return false;
    }

    RemoveOnDeath(): boolean {
        return false
    }
}