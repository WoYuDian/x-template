
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { Timers } from "../../../lib/timers";
import { modifier_basic } from "../modifier_basic";
import { modifier_bow_attributes } from "./bow_attributes";
@registerModifier()
export class modifier_bow_armed_buff extends modifier_basic {
    damage: number = 0
    projectileSpeedBonus: number = 0
    attackSpeedReduction: number = 0
    initialAttackType: UnitAttackCapability
    OnCreated(params: any): void {
        if(!IsServer()) return

        const caster = this.GetCaster();
        const buff = caster.FindModifierByName(modifier_bow_attributes.name) as modifier_bow_attributes;
        const damageFactor = buff? buff.damageFactor: 1
        const damage = this.GetAbility().GetSpecialValueFor('basic_damage') * damageFactor
        this.attackSpeedReduction = buff? buff.attackSpeedReduction: 0
        this.damage = damage

        const parent = this.GetParent();
        this.initialAttackType = parent.GetAttackCapability()
        this.projectileSpeedBonus = 2000 - parent.GetProjectileSpeed()
        
        if(caster.GetRangedProjectileName() != '') {
            parent.SetRangedProjectileName(caster.GetRangedProjectileName())
        } else {
            parent.SetRangedProjectileName('particles/econ/items/drow/drow_ti9_immortal/drow_ti9_base_attack.vpcf')
        }
        
        parent.SetAttackCapability(UnitAttackCapability.RANGED_ATTACK)

        Timers.CreateTimer(0.1, (function() {
            this.SetHasCustomTransmitterData(true)
            this.SendBuffRefreshToClients()
        }).bind(this))

        this.StartIntervalThink(FrameTime())
    }

    OnDestroy(): void {
        if(!IsServer()) return;

        this.GetParent().SetAttackCapability(this.initialAttackType)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return

        this.GetCaster().SetAbsOrigin(this.GetParent().GetAbsOrigin())
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            damage: this.damage,
            projectileSpeedBonus: this.projectileSpeedBonus,
            attackSpeedReduction: this.attackSpeedReduction
        }
    }

    HandleCustomTransmitterData(data) {       
        this.damage = data.damage
        this.projectileSpeedBonus = data.projectileSpeedBonus
        this.attackSpeedReduction = data.attackSpeedReduction
    }  

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ATTACK_RANGE_BASE_OVERRIDE, ModifierFunction.PROJECTILE_SPEED_BONUS, 
            ModifierFunction.ON_ATTACK_LANDED, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, ModifierFunction.TOOLTIP]
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        if(!IsServer()) return;

        const parent = this.GetParent();
        if(event.attacker != parent) return;

        Timers.CreateTimer(0.1, (function() {
            ApplyDamage({
                victim: event.target,
                attacker: this.GetCaster(),
                damage: this.damage,
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }).bind(this)) 
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return -this.attackSpeedReduction
    }

    GetModifierProjectileSpeedBonus(): number {
        return this.projectileSpeedBonus
    }

    GetModifierAttackRangeOverride(): number {
        return 1000
    }

    OnTooltip(): number {
        return this.damage
    }
}