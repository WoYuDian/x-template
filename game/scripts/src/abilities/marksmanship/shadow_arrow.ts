import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shadow_arrow } from "../../modifiers/marksmanship/shadow_arrow";

@registerAbility()
export class shadow_arrow extends BaseAbility
{    
    GetIntrinsicModifierName(): string {
        return modifier_shadow_arrow.name
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            let primaryStateDamage = 0;
            if(caster.IsHero()) {
                primaryStateDamage = this.GetSpecialValueFor('damage_factor') * caster.GetPrimaryStatValue()
            }                
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: primaryStateDamage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            EmitSoundOn('Hero_SkywrathMage.ConcussiveShot.Cast', target)

            return true;
        }
    }
}