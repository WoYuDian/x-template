
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { modifier_out_of_world } from "../../../modifiers/common/modifier_out_of_world";
import { fabao_ability } from "../fabao_ability";
import { modifier_shield_armed_buff } from "./shield_armed_buff";
@registerAbility()
export class cast_shield_armed extends fabao_ability
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
                EffectName: 'particles/skywrath_mage_concussive_shot.vpcf',
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
            target.AddNewModifier(this.GetCaster(), this, modifier_shield_armed_buff.name, {})
            return true;
        }
    }
}