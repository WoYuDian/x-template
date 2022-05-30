import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { Timers } from "../../lib/timers";
const relatedAbilityList = ['sword_shot', 'sword_sudden']

@registerModifier()
export class modifier_leverage_back extends BaseModifier {
    damageReduction: number
    distance: number
    speed: number
    particleId: ParticleID
    isBacking: boolean
    OnCreated(params: object): void {        
        this.damageReduction = - this.GetAbility().GetSpecialValueFor('damage_reduction')//((100 - this.GetAbility().GetSpecialValueFor('damage_reduction')) / 100) * this.GetParent().GetAttackDamage()
        this.distance = this.GetAbility().GetSpecialValueFor('distance')
        this.speed = this.GetAbility().GetSpecialValueFor('speed')
        this.isBacking = false

        if(!IsServer()) return;
        this.particleId = ParticleManager.CreateParticle( "particles/econ/items/windrunner/windranger_arcana/windranger_arcana_ambient.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
    }

    OnRefresh(params: object): void {
        // if(!IsServer()) return;
        this.damageReduction = this.GetAbility().GetSpecialValueFor('damage_reduction')
        this.distance = this.GetAbility().GetSpecialValueFor('distance')
        this.speed = this.GetAbility().GetSpecialValueFor('speed')
        this.damageReduction = - this.GetAbility().GetSpecialValueFor('damage_reduction')//((100 - this.GetAbility().GetSpecialValueFor('damage_reduction')) / 100) * this.GetParent().GetAttackDamage()
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK, ModifierFunction.DAMAGEOUTGOING_PERCENTAGE]
    }    

    OnAttack(event: ModifierAttackEvent): void {
        if(!IsServer()) return;
        if((event.attacker == this.GetParent()) && !this.isBacking) {
            this.isBacking = true
            const forwarVerctor = this.GetParent().GetForwardVector()

            const frameTime = FrameTime();
            const distancePerFrame = this.speed * frameTime;
            let frameNum =  this.distance / this.speed / frameTime;
            const parent = this.GetParent()
            parent.SetMoveCapability(UnitMoveCapability.NONE)
            const _this = this;
            Timers.CreateTimer(function() {
                frameNum -= 1;
    
                //@ts-ignore                
                parent.SetAbsOrigin(parent.GetAbsOrigin() + (-forwarVerctor * distancePerFrame))
                if(frameNum > 0) {
                    return frameTime
                } else {
                    _this.isBacking = false
                    FindClearSpaceForUnit(parent, parent.GetAbsOrigin(), false)
                    parent.SetMoveCapability(UnitMoveCapability.GROUND)
                }
            })
        }
    }

    GetModifierDamageOutgoing_Percentage(): number {
        return this.damageReduction
    }

    IsHidden(): boolean {
        return false
    }

}