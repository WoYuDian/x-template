
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_move } from "./modifier_move";
@registerModifier()
export class modifier_hit_watch extends BaseModifier {
    hitModifier: string
    frameTime: number
    effect: string
    modifierDuration: number
    particleId: ParticleID
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.frameTime = FrameTime()
        this.hitModifier = params.hit_modifier
        this.effect = params.effect
        this.modifierDuration = params.modifier_duration

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

        const parent = this.GetParent()
        const treeRadius = 120;
        const buildingRadius = 30;
        const blockerRadius = 70;
        const location = parent.GetAbsOrigin()

        const blockers = Entities.FindAllByClassnameWithin('npc_dota_thinker', location, blockerRadius)
        for(const blocker of blockers) {
            if(blocker.IsBaseNPC() && blocker.IsPhantomBlocker()) {
                this.handlerHit()
                return;
            }
        }

        const modifierMove = parent.FindModifierByName(modifier_move.name);

        if(modifierMove) {
            const baseLoc = GetGroundPosition(location, parent)
            //@ts-ignore
            const searchLoc = GetGroundPosition(baseLoc + Vector(modifierMove.directionX, modifierMove.directionY, modifierMove.directionZ) * buildingRadius, parent);
            if(((searchLoc.z - baseLoc.z) > 10)) {//&& !GridNav.IsTraversable(searchLoc)
                this.handlerHit()
                return;
            }
        }

        if(GridNav.IsNearbyTree(location, treeRadius, false)) {
            this.handlerHit()
            return;
        }

        const buildings = FindUnitsInRadius(
            parent.GetTeamNumber(),
            location,
            null,
            buildingRadius,
            UnitTargetTeam.BOTH,
            UnitTargetType.BUILDING,
            UnitTargetFlags.MAGIC_IMMUNE_ENEMIES + UnitTargetFlags.INVULNERABLE,
            0,
            false            
        )
    
        if(buildings.length > 0) {
            this.handlerHit()
            return;
        }
    }


    handlerHit() {
        const parent = this.GetParent()

        if(this.hitModifier) {
            parent.AddNewModifier(this.GetCaster(), this.GetAbility(), this.hitModifier, {duration: this.modifierDuration || 0})                    
        }
        if(parent.HasModifier(modifier_move.name)) {
            parent.RemoveModifierByName(modifier_move.name)
        }
        this.Destroy();
    }
}