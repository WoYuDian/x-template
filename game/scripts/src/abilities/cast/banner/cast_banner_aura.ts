
import { BaseAbility, registerAbility } from "../../../lib/dota_ts_adapter"
import { modifier_out_of_world } from "../../../modifiers/common/modifier_out_of_world";
import { fabao_ability } from "../fabao_ability";
import { modifier_banner_attributes } from "./banner_attributes";
import { modifier_banner_aura } from "./banner_aura";


@registerAbility()
export class cast_banner_aura extends fabao_ability
{    
    castRange: number
    
    
    GetIntrinsicModifierName(): string {
        return modifier_banner_aura.name
    }

    Spawn(): void {        
        super.Spawn()

        if(!IsServer()) return;
        const buff = this.GetCaster().FindModifierByName(modifier_banner_attributes.name) as modifier_banner_attributes;
        this.castRange = buff.auraRadius;        
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return  this.castRange
    }
}