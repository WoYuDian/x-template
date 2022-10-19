
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { modifier_ma_poison_debuff } from "./modifier_ma_poison_debuff";
@registerModifier()
export class modifier_ma_poison extends BaseModifier {
    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        const parent = this.GetParent()
        if(event.unit == parent) return;
        if(event.attacker != parent) return;
        if(!event.inflictor || event.inflictor.IsNull()) return;
        if(event.inflictor == this.GetAbility()) return;
        if(event.inflictor.GetName().indexOf('ma_') > -1) return;

        const duration = this.GetAbility().GetSpecialValueFor('duration_factor') * getFabaoSumOfForceOfRuleLevels(['wood'], parent)
        event.unit.AddNewModifier(parent, this.GetAbility(), modifier_ma_poison_debuff.name, {duration})
    }

    OnCreated(params: object): void {
        if(!IsServer()) return;

        const particle = ParticleManager.CreateParticle( "particles/econ/items/viper/viper_ti7_immortal/viper_poison_attack_ti7_drips.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particle, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( particle, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particle, false, false, -1, false, false) 
    }
    // GetEffectName(): string {
    //     return 'particles/units/heroes/hero_viper/viper_corrosive_debuff.vpcf'
    // }

    IsHidden(): boolean {
        return true
    }
}
