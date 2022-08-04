import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

const relatedAbilityList = ['sword_shot', 'sword_sudden', 'ju_jian_shu']

@registerModifier()
export class modifier_sword_mean_stacking extends BaseModifier {
    stackingFactor: number
    damageFactor: number
    maxStackFactor: number
    OnCreated(params: object): void {
        this.stackingFactor = this.GetAbility().GetSpecialValueFor('stacking_factor')
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.maxStackFactor = this.GetAbility().GetSpecialValueFor('max_stack_factor')

        if(!IsServer()) return;

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const stackingNum = Math.ceil(this.stackingFactor * getForceOfRuleLevel('metal', this.GetCaster()))

        this.addStacking(stackingNum)
    }

    OnDestroy(): void {
        if(!IsServer()) return;

    }
    
    OnRefresh(params: object): void {
        this.stackingFactor = this.GetAbility().GetSpecialValueFor('stacking_factor')
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.maxStackFactor = this.GetAbility().GetSpecialValueFor('max_stack_factor')      
        if(!IsServer()) return;
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
            const extraDamage = this.damageFactor * getForceOfRuleLevel('metal', event.attacker)
            
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
            
            if(RollPercentage(this.stackingFactor)) {
                this.addStacking(1)
                const effectTarget = ParticleManager.CreateParticle('particles/econ/items/juggernaut/jugg_ti8_sword/juggernaut_blade_fury_abyssal_tgt.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
                ParticleManager.SetParticleControl( effectTarget, 1, this.GetParent().GetAbsOrigin())
                ParticleManager.ReleaseParticleIndex( effectTarget )
            }
        }
    }

    addStacking(num: number) {
        const curStack = this.GetStackCount();

        const maxStack = this.maxStackFactor * getForceOfRuleLevel('metal', this.GetCaster())
        if((curStack + num) < maxStack) {
            this.SetStackCount(curStack + num)
        } else {
            this.SetStackCount(maxStack)
        }
        
        this.updateAbilityState()
    }

    IsHidden(): boolean {
        return false
    }

}