import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { resentment_stacking_owner_buff } from "./resentment_stacking_owner_buff";
@registerModifier()
export class modifier_resentment_stacking_buff extends BaseModifier {
    damageBonusPerStack: number
    healthBonusPerStack: number
    OnCreated(params: object): void {
        this.damageBonusPerStack = this.GetAbility().GetSpecialValueFor('damage_bonus_per_stack')
        this.healthBonusPerStack = this.GetAbility().GetSpecialValueFor('health_bonus_per_stack')
    }

    OnRefresh(params: object): void {
        this.damageBonusPerStack = this.GetAbility().GetSpecialValueFor('damage_bonus_per_stack')
        this.healthBonusPerStack = this.GetAbility().GetSpecialValueFor('health_bonus_per_stack')
    }
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }    

    OnDeath(event: ModifierInstanceEvent): void {
        if(event.unit != this.GetParent()) return;

        const owner = this.GetCaster()
        

        if(this.GetParent().GetUnitName() == 'npc_necromance_zombie') {
            if(owner.IsBaseNPC() && owner.IsHero()) {
                const effectTarget = ParticleManager.CreateParticle('particles/econ/items/ogre_magi/ogre_magi_arcana/ogre_magi_arcana_secondstyle_fireblast_solarfeathers.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, owner)
                ParticleManager.SetParticleControl( effectTarget, 1, owner.GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex( effectTarget )

                const modifier = owner.FindModifierByName(resentment_stacking_owner_buff.name)

                if(modifier) {                    
                    modifier.IncrementStackCount()
                    modifier.SetDuration(8, true)           
                } else {
                    owner.AddNewModifier(owner, this.GetAbility(), resentment_stacking_owner_buff.name, {duration: 8})
                }
            }
            
        }
    }

    IsHidden(): boolean {
        return this.GetParent().GetUnitName() != 'npc_necromance_zombie'
    }

}