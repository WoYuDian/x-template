


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_xuan_han_ling_yu extends BaseModifier {
    primaryStateFactor: number = 0
    damageInterval: number = 0
    radius: number = 0
    manaCostPerWave: number = 0
    particleId: ParticleID
    OnCreated(params: any): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.StartIntervalThink(this.damageInterval)
    }

    GetEffectName(): string {
        return 'particles/xuan_han_ling_yu/xuan_han_ling_yu.vpcf'
    }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
    }        

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const forceOfWaterLevel = getForceOfRuleLevel('water', this.GetAbility().GetCaster())
        const damage = forceOfWaterLevel * this.primaryStateFactor;
        const caster = this.GetCaster()
        const radius = this.radius
        
        this.GetParent().ReduceMana(this.manaCostPerWave)
        if(this.GetParent().GetMana() < this.manaCostPerWave) {
            this.GetAbility().ToggleAbility()
        }
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            //@ts-ignore
            caster.GetAbsOrigin(), 
            null, 
            radius, 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)
        
        for(const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }
    }

    IsPurgable(): boolean {
        return false
    }
}