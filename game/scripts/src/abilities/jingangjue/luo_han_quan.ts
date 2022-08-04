import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_luo_han_quan } from "../../modifiers/jingangjue/luo_han_quan";
import { Timers } from "../../lib/timers";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerAbility()
export class luo_han_quan extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster()
            
        const forwardDirection = caster.GetForwardVector().Normalized();

        const startPosition = caster.GetAbsOrigin() + forwardDirection * 20       
        const endPosition = caster.GetAbsOrigin() + forwardDirection * this.GetSpecialValueFor('radius')       

        //particles/units/heroes/hero_marci/marci_unleash_attack_quick_swipes.vpcf
        const nFXIndex = ParticleManager.CreateParticle( "particles/luo_han_quan/luo_han_quan.vpcf", ParticleAttachment.POINT, caster )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, endPosition, true )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, endPosition, true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        const enemies = FindUnitsInLine(
            caster.GetTeamNumber(), 
            //@ts-ignore
            startPosition, 
            //@ts-ignore
            endPosition, 
            null, 
            this.GetSpecialValueFor("width"), 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.HERO + UnitTargetType.CREEP, 
            UnitTargetFlags.NONE
        )

        const damage = this.GetSpecialValueFor('damage_factor') * (getForceOfRuleLevel('body', caster) + getForceOfRuleLevel('metal', caster))

        for(const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })
        }

        if(enemies.length > 0) {
            let buff = caster.FindModifierByName(modifier_luo_han_quan.name)

            if(buff) {
                buff.IncrementStackCount()           
            } else {
               buff = caster.AddNewModifier(caster, this, modifier_luo_han_quan.name, {})
               buff.SetStackCount(1)
            }
        }
    }

    IsHidden(): boolean {
        return false
    }
} 