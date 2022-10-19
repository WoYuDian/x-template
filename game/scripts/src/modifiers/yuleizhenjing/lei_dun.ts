
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_lei_dun extends BaseModifier {
    damageFactor: number = 0
    probabilityFactor: number = 0
    radius: number = 0
    OnCreated(params: any): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.probabilityFactor = this.GetAbility().GetSpecialValueFor('probability_factor');
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.probabilityFactor = this.GetAbility().GetSpecialValueFor('probability_factor');
    }

    GetEffectName(): string {
        return 'particles/items2_fx/mjollnir_shield.vpcf'
    }


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        if(event.unit != this.GetParent()) return;
        const parent = this.GetParent()
        const probability = (getForceOfRuleLevel('metal', parent) + getForceOfRuleLevel('fire', parent)) * this.probabilityFactor;

        if(RollPercentage(probability)) {
            const damage = (getForceOfRuleLevel('metal', parent) + getForceOfRuleLevel('fire', parent)) * this.damageFactor

            ApplyDamage({
                victim: event.attacker,
                attacker: parent,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })

            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_zuus/zuus_arc_lightning.vpcf", ParticleAttachment.CUSTOMORIGIN_FOLLOW, parent )
            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', event.attacker.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
        }
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}