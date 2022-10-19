


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_generic_orb_effect } from "../modifier_generic_orb_effect";
import { modifier_shan_yue_zhi_li_buff } from "./shan_yue_zhi_li_buff";

@registerModifier()
export class modifier_shan_yue_zhi_li extends modifier_generic_orb_effect {
    particleId: ParticleID
    OnCreated(params: object): void {
        super.OnCreated(params);

        this.SetStackCount(0)

        this.particleId = ParticleManager.CreateParticle( "particles/econ/items/earthshaker/earthshaker_arcana/earthshaker_arcana_totem_buff_rocks.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 5, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
    }

    OnDestroy(): void {
        super.OnDestroy()

        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
		ParticleManager.ReleaseParticleIndex(this.particleId)
    }

    OnRefresh(params: object): void {
        super.OnRefresh(params)
    }

    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.FRIENDLY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.BASIC
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('aura_radius');
    }

    GetModifierAura(): string {
        return modifier_shan_yue_zhi_li_buff.name
    }

    IsHidden(): boolean {
        return true
    }
}