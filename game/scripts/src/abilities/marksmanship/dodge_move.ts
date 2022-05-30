import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers"
@registerAbility()
export class dodge_move extends BaseAbility
{    
    OnSpellStart(): void {                
        if(!IsServer()) return;
        let vPos
        if(this.GetCursorTarget()) {
            vPos = this.GetCursorTarget().GetOrigin()
        } else {
            vPos = this.GetCursorPosition()
        }

        //@ts-ignore
        const vDirection = (vPos - this.GetCaster().GetOrigin()).Normalized()

        const caster = this.GetCaster();
        const speed = this.GetSpecialValueFor('speed');
        const distance = this.GetSpecialValueFor('distance');
        const frameTime = FrameTime();
        const distancePerFrame = speed * frameTime;
        let frameNum =  distance / speed / frameTime;
        // this.GetOwner()
        const nFXIndex = ParticleManager.CreateParticle( "particles/econ/items/windrunner/windranger_arcana/windranger_arcana_javelin_tgt.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, caster )
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, caster, ParticleAttachment.ABSORIGIN_FOLLOW, null, caster.GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( nFXIndex, 3, caster, ParticleAttachment.ABSORIGIN_FOLLOW, null, caster.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        caster.SetMoveCapability(UnitMoveCapability.NONE)
        Timers.CreateTimer(function() {
            frameNum -= 1;

            //@ts-ignore
            
            caster.SetAbsOrigin(caster.GetAbsOrigin() + vDirection * distancePerFrame)
            if(frameNum > 0) {
                return frameTime
            } else {
                FindClearSpaceForUnit(caster, caster.GetAbsOrigin(), false)
                caster.SetMoveCapability(UnitMoveCapability.GROUND)
                ParticleManager.DestroyParticle(nFXIndex, true)
            }
        })

    }

    IsHidden(): boolean {
        return false
    }
}