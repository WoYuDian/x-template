
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_han_qi_fan_she extends BaseModifier {
    OnCreated(params: any): void {
    }

    OnRefresh(params: object): void {
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }
    
    
    OnTakeDamage(params: ModifierInstanceEvent): number {
        if(!IsServer()) return;        
        if(params.attacker == this.GetParent()) return;
        if(params.unit != this.GetParent()) return;
        if(!RollPercentage(getForceOfRuleLevel('water', params.unit))) return;

        const damage = this.GetAbility().GetSpecialValueFor('primary_state_factor') * getForceOfRuleLevel('water', this.GetParent())

        ApplyDamage({
            victim: params.attacker,
            attacker: params.unit,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })

        const nFXIndex = ParticleManager.CreateParticle( "particles/han_qi_fan_she/han_qi_fan_she.vpcf", ParticleAttachment.POINT, params.unit )

        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, params.unit.GetAbsOrigin(), true )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, params.attacker.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}