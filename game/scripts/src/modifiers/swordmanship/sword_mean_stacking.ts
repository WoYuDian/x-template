import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

const relatedAbilityList = ['sword_shot', 'sword_sudden']

@registerModifier()
export class modifier_sword_mean_stacking extends BaseModifier {
    stackingProbability: number
    extraDamagePercentage: number
    OnCreated(params: object): void {
        if(!IsServer()) return;
        this.SetStackCount(999)
        this.stackingProbability = this.GetAbility().GetSpecialValueFor('stacking_probability')
        this.extraDamagePercentage = this.GetAbility().GetSpecialValueFor('extra_damage_percentage')
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;

        this.stackingProbability = this.GetAbility().GetSpecialValueFor('stacking_probability')
        this.extraDamagePercentage = this.GetAbility().GetSpecialValueFor('extra_damage_percentage')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK]
    }    

    updateAbilityState() {
        const stack = this.GetStackCount()

        for(const abilityName of relatedAbilityList) {
            if(this.GetParent().HasAbility(abilityName)) {
                if(stack >= (this.GetParent().FindAbilityByName(abilityName)?.GetSpecialValueFor('charge_cost') || 999)) {                
                    this.GetParent().FindAbilityByName(abilityName)?.SetActivated(true)
                } else {
                    this.GetParent().FindAbilityByName(abilityName)?.SetActivated(false)
                }
            }
        }

    }

    OnAttack(event: ModifierAttackEvent): void {
        if(!IsServer()) return;
        if(event.attacker == this.GetParent()) {
            const extraDamage = (this.extraDamagePercentage / 100) * this.GetParent().GetAttackDamage()
            ApplyDamage({
                victim: event.target,
                attacker: this.GetParent(),
                damage: extraDamage,
                damage_type: DamageTypes.PURE,
                ability: this.GetAbility()        
            })

            const effectTarget = ParticleManager.CreateParticle('particles/econ/items/juggernaut/jugg_ti8_sword/juggernaut_blade_fury_abyssal_tgt.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, event.target)
            ParticleManager.SetParticleControl( effectTarget, 1, event.target.GetAbsOrigin())
            ParticleManager.ReleaseParticleIndex( effectTarget )
            
            if(RollPercentage(this.stackingProbability)) {
                this.IncrementStackCount()
                this.updateAbilityState()
                const effectTarget = ParticleManager.CreateParticle('particles/econ/items/juggernaut/jugg_ti8_sword/juggernaut_blade_fury_abyssal_tgt.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
                ParticleManager.SetParticleControl( effectTarget, 1, this.GetParent().GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex( effectTarget )
            }
        }
    }

    IsHidden(): boolean {
        return false
    }

}