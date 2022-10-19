
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { modifier_ma_magnetism_debuff } from "./modifier_ma_magnetism_debuff";
@registerModifier()
export class modifier_ma_magnetism extends BaseModifier {

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
        return this.GetAbility().GetSpecialValueFor('aura_radius')
    }

    GetModifierAura(): string {
        return modifier_ma_magnetism_debuff.name
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_earth_spirit/espirit_bouldersmash_orientedmagneticwarp.vpcf'
    }

    IsHidden(): boolean {
        return true
    }
}
