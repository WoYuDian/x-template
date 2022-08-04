import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { modifier_shan_shen_ji } from "../../modifiers/jingangjue/shan_shen_ji";
@registerAbility()
export class shan_shen_ji extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster()
   
        const buff = caster.FindModifierByName(modifier_luo_han_quan.name)
        const buffCost = this.GetSpecialValueFor('buff_cost')
        if(!buff || (buff.GetStackCount() < buffCost)) {
            return
        }

        const nFXIndex = ParticleManager.CreateParticle( "particles/shan_shen_ji/shan_shen_ji_blink.vpcf", ParticleAttachment.WORLDORIGIN, null )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.WORLDORIGIN, null, caster.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        caster.AddNewModifier(caster, this, modifier_shan_shen_ji.name, {
            duration: this.GetSpecialValueFor('delay'),
            pos_x: vPos.x,
            pos_y: vPos.y,
            pos_z: vPos.z
        })

        buff.SetStackCount(buff.GetStackCount() - buffCost)
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