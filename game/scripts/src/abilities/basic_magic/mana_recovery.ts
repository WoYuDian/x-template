import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_mana_recovery } from "../../modifiers/basic_magic/modifier_mana_recovery"

@registerAbility()
export class mana_recovery extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_mana_recovery.name
    }

    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC, location: Vector, extraData: any): boolean | void {

        if(target == this.GetCaster()) {
            target.GiveMana(extraData.mana_recovery)
            
            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_keeper_of_the_light/keeper_chakra_magic.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, target )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, target.GetOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, target, ParticleAttachment.ABSORIGIN_FOLLOW, null, target.GetOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
            return true;
        }
        
    }
}