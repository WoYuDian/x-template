
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_shi_jian_dui_ji_debuff extends BaseModifier {
    damageIncrementFactor: number
    incrementInterval: number
    stackedDamage: {physical: number, magical: number, pure: number} = {physical: 0, magical: 0, pure: 0}
    OnCreated(params: object): void {
        this.damageIncrementFactor = this.GetAbility().GetSpecialValueFor('damage_increment_factor')
        this.incrementInterval = this.GetAbility().GetSpecialValueFor('increment_interval')

        if(!IsServer()) return;

        this.StartIntervalThink(this.incrementInterval)
    }

    OnRefresh(params: object): void {
        this.damageIncrementFactor = this.GetAbility().GetSpecialValueFor('damage_increment_factor')
        this.incrementInterval = this.GetAbility().GetSpecialValueFor('increment_interval')
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        this.stackedDamage.physical = this.stackedDamage.physical * (1 + this.damageIncrementFactor)
        this.stackedDamage.magical = this.stackedDamage.magical * (1 + this.damageIncrementFactor)
        this.stackedDamage.pure = this.stackedDamage.pure * (1 + this.damageIncrementFactor)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.AVOID_DAMAGE]
    }

    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        const parent = this.GetParent()
        if(event.target != parent) return 0;
        if(event.inflictor == this.GetAbility()) return 0;

        if(event.damage_type == DamageTypes.PHYSICAL) {
            this.stackedDamage.physical += event.original_damage
        } else if (event.damage_type == DamageTypes.MAGICAL) {
            this.stackedDamage.magical += event.original_damage
        } else {
            this.stackedDamage.pure += event.original_damage
        }

        //particles/units/heroes/hero_oracle/oracle_false_promise_attacked.vpcf
        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_oracle/oracle_false_promise_attacked.vpcf", ParticleAttachment.POINT, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        //@ts-ignore
        ParticleManager.ReleaseParticleIndex( nFXIndex )
        return 1        
    }

    OnDestroy(): void {
        if(!IsServer()) return

        const parent = this.GetParent()
        const caster = this.GetCaster()

        ApplyDamage({
            victim: parent,
            attacker: caster,
            damage: this.stackedDamage.physical,
            damage_type: DamageTypes.PHYSICAL,
            ability: this.GetAbility()
        })

        ApplyDamage({
            victim: parent,
            attacker: caster,
            damage: this.stackedDamage.magical,
            damage_type: DamageTypes.PHYSICAL,
            ability: this.GetAbility()
        })

        ApplyDamage({
            victim: parent,
            attacker: caster,
            damage: this.stackedDamage.pure,
            damage_type: DamageTypes.PHYSICAL,
            ability: this.GetAbility()
        })

        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_oracle/oracle_false_promise_dmg.vpcf", ParticleAttachment.POINT, parent )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_oracle/oracle_false_promise.vpcf'
    }
}