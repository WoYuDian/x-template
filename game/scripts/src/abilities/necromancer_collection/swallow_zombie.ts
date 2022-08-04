import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"

@registerAbility()
export class swallow_zombie extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const target = this.GetCursorTarget();

        const caster = this.GetCaster()
        if(target && target.IsBaseNPC() && (target.GetTeam() == caster.GetTeam()))  {
            const baseHeal = this.GetSpecialValueFor('base_recovery')
            const extraHeal = this.GetSpecialValueFor('recovery_factor') * (getForceOfRuleLevel('rock', caster) + getForceOfRuleLevel('spirit', caster))

            this.GetCaster().Heal(baseHeal + extraHeal, this)

            const effect = ParticleManager.CreateParticle('particles/econ/items/undying/fall20_undying_head/fall20_undying_soul_rip_heal.vpcf', ParticleAttachment.ABSORIGIN_FOLLOW, this.GetCaster())
            ParticleManager.SetParticleControl( effect, 0, this.GetCaster().GetAbsOrigin())
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