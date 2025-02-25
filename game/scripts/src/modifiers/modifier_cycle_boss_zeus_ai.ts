import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";

@registerModifier()
export class modifier_cycle_boss_zeus_ai extends BaseModifier {
    IsHidden(): boolean {
        return false;
    }

    OnCreated(params: object): void {
        if(IsServer()) {
            this.StartIntervalThink(3)
        }
    }

    OnIntervalThink(): void {
        const unit = this.GetParent()
        let globalLightBolt = unit.FindAbilityByName('global_light_bolt');
        if(!globalLightBolt) {            
            globalLightBolt = unit.AddAbility('global_light_bolt');
            globalLightBolt.SetLevel(3)
        }
        globalLightBolt.EndCooldown()
        unit.CastAbilityNoTarget(globalLightBolt, 0)
    }
}