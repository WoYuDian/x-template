import { BaseAbility, BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { resentment_stacking_owner_buff } from "./resentment_stacking_owner_buff";
@registerModifier()
export class modifier_resentment_stacking_buff extends BaseModifier {
    OnCreated(params: object): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }    

    OnDeath(event: ModifierInstanceEvent): void {
        if(event.unit != this.GetParent()) return;

        const owner = this.GetCaster()
        

        if((this.GetParent().GetUnitName() == 'npc_necromance_zombie') || (this.GetParent().GetUnitName() == 'shang_gu_zhang_chang_ghost')) {
            if(owner.IsBaseNPC()) {
                const effectTarget = ParticleManager.CreateParticle('particles/econ/items/ogre_magi/ogre_magi_arcana/ogre_magi_arcana_secondstyle_fireblast_solarfeathers.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, owner)
                ParticleManager.SetParticleControl( effectTarget, 1, owner.GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex( effectTarget )

                const modifier = owner.FindModifierByName(resentment_stacking_owner_buff.name)
                if(modifier) {                    
                    modifier.IncrementStackCount()
                    modifier.SetDuration(8, true)    
                    //@ts-ignore
                    modifier.OnRefresh({})
                } else {
                    owner.AddNewModifier(owner, this.GetAbility(), resentment_stacking_owner_buff.name, {duration: 8})
                }
            }
            
        }
    }

    IsHidden(): boolean {
        return true
    }

}