import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_fen_tian_zhi_yan } from "../../modifiers/fentianjue/fen_tian_zhi_yan";
@registerAbility()
export class fen_tian_zhi_yan extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }

            const caster = this.GetCaster();            

            //@ts-ignore
            const vDirection = (vPos - this.GetCaster().GetAbsOrigin()).Normalized()
            const duration = this.GetSpecialValueFor('base_duration') + (getForceOfRuleLevel('fire',  caster) * this.GetSpecialValueFor('duration_factor'))
            CreateModifierThinker(this.GetCaster(), this, modifier_fen_tian_zhi_yan.name, {duration: duration}, vPos, caster.GetTeamNumber(), false)
            
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    IsHidden(): boolean {
        return false
    }
} 