
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { printObject } from "../../util";
@registerModifier()
export class modifier_witchcraft_base extends BaseModifier {
    lifeSteal: number
    spellLifeSteal: number
    OnCreated(params: object): void {
            this.lifeSteal = this.GetAbility().GetLevelSpecialValueFor('life_steal', this.GetAbility().GetLevel())
            this.spellLifeSteal = this.GetAbility().GetLevelSpecialValueFor('spell_life_steal', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.lifeSteal = this.GetAbility().GetLevelSpecialValueFor('life_steal', this.GetAbility().GetLevel())
        this.spellLifeSteal = this.GetAbility().GetLevelSpecialValueFor('spell_life_steal', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(params): number {
        if(!IsServer()) return;        
        if(params.attacker != this.GetParent()) return;
        if(params.unit == this.GetParent()) return;
        if(params.unit.IsBuilding()) return;

        if(params.damage_type == DamageTypes.PHYSICAL) {
            const heal = params.damage * (this.lifeSteal / 100);
            this.GetParent().Heal(heal, this.GetAbility())
            const effect = ParticleManager.CreateParticle('particles/generic_gameplay/generic_lifesteal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
            ParticleManager.SetParticleControl( effect, 1, this.GetParent().GetAbsOrigin())
		    ParticleManager.ReleaseParticleIndex( effect )
        } else if (params.damage_type == DamageTypes.MAGICAL) {
            const heal = params.damage * (this.spellLifeSteal / 100);
            this.GetParent().Heal(heal, this.GetAbility())
            const effect = ParticleManager.CreateParticle('particles/items3_fx/octarine_core_lifesteal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent())
            ParticleManager.SetParticleControl( effect, 1, this.GetParent().GetAbsOrigin())
		    ParticleManager.ReleaseParticleIndex( effect )
        }
    }
}