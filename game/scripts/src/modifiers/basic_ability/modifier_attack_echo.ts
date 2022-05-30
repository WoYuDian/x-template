
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { Timers } from "../../lib/timers";
@registerModifier()
export class modifier_attack_echo extends BaseModifier {
    primaryStateFactor: number
    OnCreated(params: object): void {
            this.primaryStateFactor = this.GetAbility().GetLevelSpecialValueFor('primary_state_factor', this.GetAbility().GetLevel() - 1)  
    }

    OnRefresh(params: object): void {
            this.primaryStateFactor = this.GetAbility().GetLevelSpecialValueFor('primary_state_factor', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK]
    }

    OnAttack(event: ModifierAttackEvent): void {
        if(event.attacker != this.GetAbility().GetOwner()) return;

        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_faceless_void/faceless_void_time_lock_bash.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, event.target )
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetOrigin(), true )
        ParticleManager.SetParticleControlEnt( nFXIndex, 3, event.target, ParticleAttachment.ABSORIGIN_FOLLOW, null, event.target.GetOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        const _this = this;
        Timers.CreateTimer(0.25, function() {
            ApplyDamage({
                victim: event.target,
                attacker: event.attacker,
                damage: _this.primaryStateFactor * (event.attacker.IsHero()? event.attacker.GetPrimaryStatValue(): 0),
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: _this.GetAbility()
            })
        })

    }
}