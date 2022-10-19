
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_banner_attributes } from "./banner_attributes";
import { modifier_banner_aura_debuff } from "./banner_aura_debuff";
@registerModifier()
export class modifier_banner_aura extends BaseModifier {
    auraRadius: number
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_banner_attributes.name) as modifier_banner_attributes;
        this.auraRadius = buff.auraRadius;

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))

        const particleId = ParticleManager.CreateParticle( "particles/cast_banner_aura/cast_banner_aura.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControl( particleId, 2, Vector(this.auraRadius, this.auraRadius / 10, 0))
        this.AddParticle(particleId, false, false, -1, false, false)    
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            auraRadius: this.auraRadius
        }
    }

    HandleCustomTransmitterData(data) {       
        this.auraRadius = data.auraRadius
    } 

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.ALL
    }

    GetAuraRadius(): number {
        return this.auraRadius;
    }

    GetModifierAura(): string {
        return modifier_banner_aura_debuff.name
    }

    IsHidden(): boolean {
        return true
    }
}