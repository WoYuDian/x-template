import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class swallow_zombie extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const target = this.GetCursorTarget();

        if(target && target.IsBaseNPC() && (target.GetTeam() == this.GetCaster().GetTeam()))  {
            const baseHeal = this.GetSpecialValueFor('base_recovery')
            const extraHeal = this.GetSpecialValueFor('recovery_factor')

            this.GetCaster().Heal(baseHeal + extraHeal, this)

            const effect = ParticleManager.CreateParticle('particles/generic_gameplay/generic_lifesteal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetCaster())
            ParticleManager.SetParticleControl( effect, 1, this.GetCaster().GetAbsOrigin())
		    ParticleManager.ReleaseParticleIndex( effect )

            target.ForceKill(false)
            const effectTarget = ParticleManager.CreateParticle('particles/units/heroes/hero_bane/bane_sap.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, target)
            ParticleManager.SetParticleControl( effectTarget, 1, target.GetAbsOrigin())
		    ParticleManager.ReleaseParticleIndex( effectTarget )
        }
    }

    IsHidden(): boolean {
        return false
    }

}