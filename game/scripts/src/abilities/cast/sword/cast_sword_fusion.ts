
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { modifier_out_of_world } from "../../../modifiers/common/modifier_out_of_world";
import { calcDistanceOfTwoPoint } from "../../../util";
import { modifier_sword_attributes } from "./sword_attributes";
import { modifier_sword_fusion_buff } from "./sword_fusion_buff";

@registerAbility()
export class cast_sword_fusion extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }

    OnSpellStart(): void {                
        // if(IsServer()) {
            const target = this.GetCursorTarget()
            if(!target) return;
            
            const caster = this.GetCaster();
            if(target == caster) return;
            //@ts-ignore

            const speed = caster.GetBaseMoveSpeed() * 5
            caster.AddNewModifier(caster, this, modifier_out_of_world.name, {})
            ProjectileManager.CreateTrackingProjectile({
                //@ts-ignore
                vSourceLoc: caster.GetAbsOrigin(),
                Target: target,
                Ability: this,
                EffectName: 'particles/cast_sword_fusion/cast_sword_fusion.vpcf',
                bDodgeable: false,
                bProvidesVision: true,
                iMoveSpeed: speed,
                iVisionRadius: 300,
                iVisionTeamNumber: caster.GetTeamNumber()
            })
    }

    IsHidden(): boolean {
        return false
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC, location: Vector, extraData: any): boolean | void {
        if(target && (target.GetTeam() == this.GetCaster().GetTeam())) {
            target.AddNewModifier(this.GetCaster(), this, modifier_sword_fusion_buff.name, {})
            return true;
        }
    }
}