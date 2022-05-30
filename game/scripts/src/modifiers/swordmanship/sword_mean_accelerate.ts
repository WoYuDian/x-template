import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_sword_mean_accelerate extends BaseModifier {
    triggerProbabilty: number
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.triggerProbabilty = this.GetAbility().GetSpecialValueFor('trigger_probabilty')
        const owner = this.GetParent()

        let ability = owner.FindAbilityByName('juggernaut_omni_slash')

        if(!ability) {
            ability = owner.AddAbility('juggernaut_omni_slash')
            ability.SetLevel(1)
        }
    }

    OnRefresh(params: object): void {
        this.triggerProbabilty = this.GetAbility().GetSpecialValueFor('trigger_probabilty')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK]
    }    

    OnAttack(event: ModifierAttackEvent): void {
        if(!IsServer()) return;
        if(this.GetParent().HasModifier('modifier_juggernaut_omnislash')) return;
        if(event.attacker == this.GetParent()) {
            if(RollPercentage(this.triggerProbabilty)) {            
                const ability = this.GetParent().FindAbilityByName('juggernaut_omni_slash')
                if(ability) {
                    this.GetParent().CastAbilityOnTarget(event.target, ability, this.GetParent().GetPlayerOwnerID())
                }
            }
        }
    }

    IsHidden(): boolean {
        return false
    }

}