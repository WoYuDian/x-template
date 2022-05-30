import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"
@registerAbility()
export class sword_sudden extends BaseAbility
{    
    OnSpellStart(): void {                
        if(!IsServer()) return;
        const owner = this.GetOwner()

        if(owner.IsBaseNPC() && owner.HasModifier(modifier_sword_mean_stacking.name)) {
            const swordMeanModifier = owner.FindModifierByName(modifier_sword_mean_stacking.name);

            //@ts-ignore
            swordMeanModifier.updateAbilityState()
            if(swordMeanModifier.GetStackCount() < this.GetSpecialValueFor('charge_cost')) {
                return
            } else {
                swordMeanModifier.SetStackCount(swordMeanModifier.GetStackCount() - this.GetSpecialValueFor('charge_cost'))
                //@ts-ignore
                swordMeanModifier.updateAbilityState()
            }                
        } else {
            return;
        }

        if (this.GetCursorPosition() == this.GetCaster().GetAbsOrigin()) {
            //@ts-ignore
            this.GetCaster().SetCursorPosition(this.GetCursorPosition() + this.GetCaster().GetForwardVector())
        }

        let original_position =  this.GetCaster().GetAbsOrigin()
	
        //@ts-ignore
        let final_position = this.GetCaster().GetAbsOrigin() + ((this.GetCursorPosition() - this.GetCaster().GetAbsOrigin()).Normalized() * math.max(math.min(((this.GetCursorPosition() - this.GetCaster().GetAbsOrigin()) * Vector(1, 1, 0)).Length2D(), this.GetSpecialValueFor("max_travel_distance") + this.GetCaster().GetCastRangeBonus()), this.GetSpecialValueFor("min_travel_distance")))        
            
        //@ts-ignore
        this.original_vector = (final_position - this.GetCaster().GetAbsOrigin()).Normalized() * (this.GetSpecialValueFor("max_travel_distance") + this.GetCaster().GetCastRangeBonus())
        
        //@ts-ignore
        this.GetCaster().SetForwardVector(this.original_vector.Normalized())
        
        // this.GetCaster().EmitSound("Hero_VoidSpirit.AstralStep.Start")
        
        let step_particle = ParticleManager.CreateParticle("particles/sword_sudden/sword_sudden.vpcf", ParticleAttachment.WORLDORIGIN, this.GetCaster())
        ParticleManager.SetParticleControl(step_particle, 0, this.GetCaster().GetAbsOrigin())
        //@ts-ignore
        ParticleManager.SetParticleControl(step_particle, 1, final_position)
        ParticleManager.ReleaseParticleIndex(step_particle)

        //@ts-ignore
        const enemies = FindUnitsInLine(this.GetCaster().GetTeamNumber(), this.GetCaster().GetAbsOrigin(), final_position, null, this.GetSpecialValueFor("radius"), UnitTargetTeam.ENEMY, UnitTargetType.HERO + UnitTargetType.CREEP, UnitTargetFlags.NONE)
        
        const caster = this.GetCaster();
        const basicDamage = this.GetSpecialValueFor('basic_damage')
        let primaryStateDamage = 0;
        if(caster.IsHero()) {
            primaryStateDamage = this.GetSpecialValueFor('primary_state_factor') * caster.GetPrimaryStatValue()
        }   
        for(const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: caster,
                damage: primaryStateDamage + basicDamage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            const origin = enemy.GetOrigin()

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/items/bloodseeker/bloodseeker_eztzhok_weapon/bloodseeker_bloodbath_eztzhok_burst.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, enemy )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, enemy, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, enemy, ParticleAttachment.ABSORIGIN_FOLLOW, null, origin, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
        }

        //@ts-ignore
        FindClearSpaceForUnit(this.GetCaster(), final_position, false)
    }

    IsHidden(): boolean {
        return false
    }
}