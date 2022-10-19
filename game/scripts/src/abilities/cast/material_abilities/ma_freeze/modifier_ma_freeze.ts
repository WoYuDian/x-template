
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
import { modifier_ma_freeze_debuff } from "./modifier_ma_freeze_debuff";
@registerModifier()
export class modifier_ma_freeze extends BaseModifier {
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

        const duration = this.GetAbility().GetSpecialValueFor('duration_factor') * getFabaoSumOfForceOfRuleLevels(['water'], parent)
        event.unit.AddNewModifier(parent, this.GetAbility(), modifier_ma_freeze_debuff.name, {duration})
    }

    OnCreated(params: object): void {
        if(!IsServer()) return;

        const particle = ParticleManager.CreateParticle( "particles/ma_freeze/ma_freeze.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particle, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( particle, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particle, false, false, -1, false, false) 
    }
    // GetEffectName(): string {
    //     return 'particles/units/heroes/hero_lich/lich_ice_age.vpcf'
    // }

    IsHidden(): boolean {
        return true
    }
}
