
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class lei_dian_chang_debuff extends BaseModifier {
    damageFactor: number = 0
    stackPerInterval: number = 0
    maxStack: number = 0
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.SetStackCount(0)
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.stackPerInterval = this.GetAbility().GetSpecialValueFor('stack_per_interval');
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack');

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const curStack = this.GetStackCount();

        if(curStack >= this.maxStack) return;

        this.SetStackCount(curStack + this.stackPerInterval)
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.stackPerInterval = this.GetAbility().GetSpecialValueFor('stack_per_interval');
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack');
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    GetEffectName(): string {
        return 'particles/econ/wards/disruptor/disruptor_ward/disruptor_ward_ambient.vpcf'
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        const caster = this.GetAbility().GetCaster()
        if(event.attacker != caster) return;
        if(event.unit != this.GetParent()) return;
        if(event.inflictor == this.GetAbility()) return;

        const stackCount = this.GetStackCount()
        if(stackCount < 1) return;

        const damage = this.damageFactor * (getForceOfRuleLevel('metal', caster) + getForceOfRuleLevel('fire', caster)) * stackCount
        ApplyDamage({
            victim: event.unit,
            attacker: caster,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            damage_flags: DamageFlag.NONE,
            ability: this.GetAbility()
        })

        this.SetStackCount(0)

    }
}