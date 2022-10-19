
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_banner_attributes } from "./banner_attributes";
@registerModifier()
export class modifier_banner_aura_debuff extends BaseModifier {
    damage: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return

        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_banner_attributes.name) as modifier_banner_attributes;
        const damageFactor = buff? buff.damageFactor: 1
        const damage = this.GetAbility().GetSpecialValueFor('basic_damage') * damageFactor
        this.damage = damage

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))

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

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            damage: this.damage,
        }
    }

    HandleCustomTransmitterData(data) {       
        this.damage = data.damage
    }  

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.FIXED_DAY_VISION, ModifierFunction.FIXED_NIGHT_VISION]
    }

    GetFixedDayVision(): number {
        return 100        
    }

    GetFixedNightVision(): number {
        return 100
    }


}