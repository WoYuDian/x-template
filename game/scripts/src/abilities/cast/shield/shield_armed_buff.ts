
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_basic } from "../modifier_basic";
import { modifier_shield_attributes } from "./shield_attributes";
@registerModifier()
export class modifier_shield_armed_buff extends modifier_basic {
    armorBonus: number = 0
    magicResistance: number = 0
    fabaoBuff: modifier_shield_attributes
    OnCreated(params: any): void {
        if(!IsServer()) return

        const caster = this.GetCaster();
        this.fabaoBuff = caster.FindModifierByName(modifier_shield_attributes.name) as modifier_shield_attributes;

        this.armorBonus = this.fabaoBuff.armorBonus
        this.magicResistance = this.fabaoBuff.magicResistance

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))

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
            armorBonus: this.armorBonus,
            magicResistance: this.magicResistance
        }
    }

    HandleCustomTransmitterData(data) {       
        this.armorBonus = data.armorBonus
        this.magicResistance = data.magicResistance
    }  

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.AVOID_DAMAGE, ModifierFunction.MAGICAL_RESISTANCE_BONUS, ModifierFunction.PHYSICAL_ARMOR_BONUS]
    }

    GetModifierMagicalResistanceBonus(event: ModifierAttackEvent): number {
        return this.magicResistance
    }

    GetModifierPhysicalArmorBonus(event: ModifierAttackEvent): number {
        return this.armorBonus
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {

    }

    GetEffectName(): string {
        return 'particles/cast_shield/cast_shield_buff.vpcf'
    }

    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        if(!IsServer()) return;
        const parent = this.GetParent()
        if(event.target != parent) return 0;
        if(event.attacker == parent) return 0;

        const nFXIndex = ParticleManager.CreateParticle( "particles/neutral_fx/ogre_bruiser_smash_ground_impact_flat.vpcf", ParticleAttachment.POINT, parent )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        if(event.damage > this.fabaoBuff.curShield) {
            const curShield = this.fabaoBuff.curShield
            this.fabaoBuff.curShield = 0
            ApplyDamage({
                victim: event.target,
                attacker: event.attacker,
                damage: event.damage - curShield,
                damage_type: event.damage_type,
                damage_flags: DamageFlag.NONE,
                ability: event.inflictor
            })
            return 1
        } else {
            this.fabaoBuff.curShield -= event.damage
            return 1
        }
    }
}