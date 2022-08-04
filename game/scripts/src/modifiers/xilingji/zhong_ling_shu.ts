


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_zhong_ling_shu extends BaseModifier {
    particleId: ParticleID
    healthFactor: number = 0
    forceOfWood: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.healthFactor = this.GetAbility().GetSpecialValueFor('health_factor')
        this.forceOfWood = getForceOfRuleLevel('wood', this.GetAbility().GetCaster())
        this.SetStackCount(1)

        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            healthFactor: this.healthFactor,
            forceOfWood: this.forceOfWood
        }
    }

    HandleCustomTransmitterData(data) {
        this.healthFactor = data.healthFactor
        this.forceOfWood = data.forceOfWood
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.EXTRA_HEALTH_BONUS]
    }

    GetModifierExtraHealthBonus(): number {
        return this.healthFactor * this.forceOfWood
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        if(this.GetParent().GetUnitName() == 'zhong_ling_shu_tree') {            
            const nFXIndex = ParticleManager.CreateParticle( "particles/world_destruction_fx/tree_oak_01_destruction.vpcf", ParticleAttachment.POINT, this.GetCaster() )            
            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null,  this.GetParent().GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            this.GetParent().ForceKill(false)
            this.GetParent().RemoveSelf()
        }
    }

    IsDebuff(): boolean {
        return this.GetCaster().GetTeamNumber() == this.GetParent().GetTeamNumber()
    }

    IsPurgable(): boolean {
        return false
    }
}