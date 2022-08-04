
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_luo_han_quan } from "./luo_han_quan";

@registerModifier()
export class modifier_jin_gang_hou extends BaseModifier {
    damageFactor: number = 0
    particleId: ParticleID
    OnCreated(params: any): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        if(!IsServer()) return;        
        const caster = this.GetCaster()
        const damage = (getForceOfRuleLevel('metal', caster) + getForceOfRuleLevel('body', caster)) * this.damageFactor

        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DamageTypes.PHYSICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })        
    }
    
    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
    }

    GetEffectName(): string {
        return 'particles/jin_gang_hou/jin_gang_hou_debuff.vpcf'
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.STUNNED]: true
        }
    }

    IsPurgable(): boolean {
        return false
    }
}