import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_zombie_blast_buff extends BaseModifier {
    damageFactor: number
    blastRadius: number
    OnCreated(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.blastRadius = this.GetAbility().GetSpecialValueFor('blast_radius')
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.blastRadius = this.GetAbility().GetSpecialValueFor('blast_radius')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }    

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        if(event.unit != this.GetParent()) return;
        if(!this.GetAbility()) return;
        
        const owner = this.GetAbility().GetOwner()        

        if(this.GetParent().GetUnitName() == 'npc_necromance_zombie') {
            if(owner.IsBaseNPC() && owner.IsHero()) {
                const effectTarget = ParticleManager.CreateParticle('particles/econ/items/ogre_magi/ogre_magi_arcana/ogre_magi_arcana_secondstyle_fireblast_solarfeathers.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
                ParticleManager.SetParticleControl( effectTarget, 1, this.GetParent().GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex( effectTarget )
        

                const damage = (getForceOfRuleLevel('rock', owner) + getForceOfRuleLevel('spirit', owner)) * this.damageFactor;
                const enemies = FindUnitsInRadius(
                    this.GetParent().GetTeamNumber(), 
                    this.GetParent().GetAbsOrigin(), 
                    null, 
                    this.blastRadius, 
                    UnitTargetTeam.ENEMY, 
                    UnitTargetType.BASIC + UnitTargetType.HERO, 
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,
                    false)
                    
                for(const enemy of enemies) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: this.GetParent(),
                        damage: damage,
                        damage_type: DamageTypes.MAGICAL,
                        ability: this.GetAbility()
                
                    })
                }
            }
            
        }
    }

    IsHidden(): boolean {
        return this.GetParent().GetUnitName() != 'npc_necromance_zombie'
    }

}