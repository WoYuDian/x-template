
import { getFabaoSumOfForceOfRuleLevels, getFabaoOwner } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ma_lifesteal extends BaseModifier {
    owner: CDOTA_BaseNPC
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.owner = getFabaoOwner(this.GetParent())
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        if(event.attacker != this.GetParent()) return;

        if(this.owner) {
            const lifeStealFactor = getFabaoSumOfForceOfRuleLevels(['wood'], this.GetParent()) * this.GetAbility().GetSpecialValueFor('lifesteal_percentage_factor') / 100
            this.owner.Heal(lifeStealFactor * event.damage, this.GetAbility())

            const effect = ParticleManager.CreateParticle('particles/generic_gameplay/generic_lifesteal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.owner)
            ParticleManager.SetParticleControl( effect, 1, this.owner.GetAbsOrigin())
		    ParticleManager.ReleaseParticleIndex( effect )
        }
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_treant/treant_livingarmor.vpcf'
    }

    IsHidden(): boolean {
        return true
    }
}
