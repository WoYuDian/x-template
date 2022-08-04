
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()

export class modifier_move extends BaseModifier {
    speed: number = 0
    directionX: number
    directionY: number
    directionZ: number
    frameTime: number
    isJump: boolean
    jumpHeight: number
    distance: number
    curTime: number
    gravity: number
    effect: string
    particleId: ParticleID
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.speed = params.speed;
        this.frameTime = FrameTime()
        this.directionX = params.direction_x
        this.directionY = params.direction_y
        this.directionZ = params.direction_z
        this.effect = params.effect
        this.isJump = params.is_jump || false;
        
        if(this.isJump) {
            this.jumpHeight = params.jump_height || 500
            this.distance = this.GetDuration() * this.speed;
            this.curTime = 0;
            this.gravity = this.jumpHeight / Math.pow(this.distance / 2, 2)
        }
        if(this.effect) {
            this.particleId = ParticleManager.CreateParticle( this.effect, ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
            ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
            ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        }

        this.StartIntervalThink(this.frameTime)
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        if(this.particleId) {
            ParticleManager.DestroyParticle(this.particleId, false)
            ParticleManager.ReleaseParticleIndex(this.particleId)
        }        
        const unit = this.GetParent()
        FindClearSpaceForUnit(unit, unit.GetAbsOrigin(), false)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        
        const positionVerctor = this.GetParent().GetAbsOrigin() + (Vector(this.directionX, this.directionY, this.directionZ) * this.speed * this.frameTime)

        if(this.isJump) {            
            let curHeight = 0;
            this.curTime += this.frameTime;
            curHeight = -this.gravity * Math.pow((this.curTime * this.speed - (this.distance / 2)), 2) + this.jumpHeight
            //@ts-ignore
            positionVerctor.z = curHeight
        }
        //@ts-ignore
        this.GetParent().SetAbsOrigin(positionVerctor)
    }
}