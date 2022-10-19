import { modifier_gui_wang_fire_debuff } from "./gui_wang_fire_debuff";
import { BaseAbility, BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_gui_wang_fire extends BaseModifier {
    
    IsAura(): boolean {
        return true
    }

    GetAuraSearchTeam(): UnitTargetTeam {
        return UnitTargetTeam.ENEMY
    }

    GetAuraSearchType(): UnitTargetType {
        return UnitTargetType.BASIC + UnitTargetType.HERO
    }

    GetAuraRadius(): number {
        return this.GetAbility().GetSpecialValueFor('fire_radius');
    }

    GetModifierAura(): string {
        return modifier_gui_wang_fire_debuff.name
    }

    GetEffectName(): string {
        return 'particles/you_ming_ji_dian/gui_wang_fire_aura.vpcf'
    }

    IsHidden(): boolean {
        return true;
    }
}