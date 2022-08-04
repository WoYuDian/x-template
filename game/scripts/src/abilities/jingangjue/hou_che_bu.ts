import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_move } from "../../modifiers/common/modifier_move";
@registerAbility()
export class hou_che_bu extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster();            

        const forwardDirection = caster.GetForwardVector().Normalized();

        const speed = this.GetSpecialValueFor('speed')
        const distance = this.GetSpecialValueFor('distance')
        const duration = distance / speed
        caster.AddNewModifier(caster, this, modifier_move.name, {
            duration: duration,
            speed: speed,
            direction_x: -forwardDirection.x,
            direction_y: -forwardDirection.y,
            direction_z: -forwardDirection.z,
            is_jump: true,
            jump_height: 200
        })
            
    }

    IsHidden(): boolean {
        return false
    }
} 