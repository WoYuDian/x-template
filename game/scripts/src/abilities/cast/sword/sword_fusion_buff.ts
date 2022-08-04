
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_basic } from "../modifier_basic";
import { modifier_sword_attributes } from "./sword_attributes";
@registerModifier()
export class modifier_sword_fusion_buff extends modifier_basic {
    damageBonus: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return

        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_sword_attributes.name) as modifier_sword_attributes;
        const damageFactor = buff? buff.damageFactor: 1
        const damageBonus = this.GetAbility().GetSpecialValueFor('basic_attack_bonus') * damageFactor
        this.damageBonus = damageBonus
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()

        this.StartIntervalThink(FrameTime())
    }

    OnIntervalThink(): void {
        if(!IsServer()) return

        this.GetCaster().SetAbsOrigin(this.GetParent().GetAbsOrigin())
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            damageBonus: this.damageBonus,
        }
    }

    HandleCustomTransmitterData(data) {       
        this.damageBonus = data.damageBonus
    }  

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PREATTACK_BONUS_DAMAGE]
    }

    GetModifierPreAttack_BonusDamage(): number {
        return this.damageBonus
    }
}