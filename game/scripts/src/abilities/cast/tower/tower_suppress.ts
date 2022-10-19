
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_tower_suppress_debuff } from "./tower_suppress_debuff";
import { modifier_tower_attributes } from "./tower_attributes";
@registerModifier()
export class modifier_tower_suppress extends BaseModifier {
    auraRadius: number
    particleId: ParticleID
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.particleId = params.particle
        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_tower_attributes.name) as modifier_tower_attributes;
        this.auraRadius = buff.auraRadius;

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))


    }

    OnDestroy(): void {
        if(!IsServer()) return;

        if(this.particleId) {
            ParticleManager.DestroyParticle(this.particleId, false)
            ParticleManager.ReleaseParticleIndex(this.particleId)
        }        
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
        return modifier_tower_suppress_debuff.name
    }
}