
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_tower_attributes } from "./tower_attributes";
@registerModifier()
export class modifier_tower_suppress_debuff extends BaseModifier {
    damage: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return

        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_tower_attributes.name) as modifier_tower_attributes;
        const damageFactor = buff? buff.damageFactor: 1
        const damage = this.GetAbility().GetSpecialValueFor('basic_damage') * damageFactor
        this.damage = damage

        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('damage_interval'))
    }

    OnIntervalThink(): void {
        if(!IsServer()) return

        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.GetCaster(),
            damage: this.damage,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })

    }

    HandleCustomTransmitterData(data) {       
        this.damage = data.damage
    }  

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.ROOTED]: true
        }
    }


}