
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_luo_han_quan } from "./luo_han_quan";

@registerModifier()
export class modifier_jin_gang_zhao extends BaseModifier {
    damageFactor: number = 0
    OnCreated(params: any): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    GetEffectName(): string {
        return 'particles/jin_gang_zhao/jin_gang_zhao_shield.vpcf'
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;        
        const parent = this.GetParent()
        if(event.attacker == parent) return;
        if(event.unit != parent) return;
        if(this.GetStackCount() < 1) return;
        const damage = this.damageFactor * (getForceOfRuleLevel('metal', parent) + getForceOfRuleLevel('body', parent))

        parent.Heal(event.damage, this.GetAbility())
        ApplyDamage({
            victim: event.attacker,
            attacker: parent,
            damage: damage,
            damage_type: DamageTypes.PURE,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })
        const from = parent.GetAbsOrigin();
        from.z = 200
        const to = event.attacker.GetAbsOrigin();
        to.z = 200
        const nFXIndex = ParticleManager.CreateParticle( "particles/jin_gang_zhao/jin_gang_zhao.vpcf", ParticleAttachment.POINT, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 9, null, ParticleAttachment.POINT, null, from, true )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, to, true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )
        this.DecrementStackCount()
        if(this.GetStackCount() < 1) this.Destroy()
    }

    IsPurgable(): boolean {
        return false
    }
}