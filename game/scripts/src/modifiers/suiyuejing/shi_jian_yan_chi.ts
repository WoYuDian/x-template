
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
@registerModifier()
export class modifier_shi_jian_yan_chi extends BaseModifier {
    delayDuratioFactor: number
    damageInterval: number
    physicalDamagePool: number = 0
    magicalDamagePool: number = 0
    pureDamagePool: number = 0
    lastAttacker: CDOTA_BaseNPC
    OnCreated(params: any): void {
        this.delayDuratioFactor = this.GetAbility().GetSpecialValueFor('delay_duration_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')

        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
        this.delayDuratioFactor = this.GetAbility().GetSpecialValueFor('delay_duration_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.AVOID_DAMAGE, ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {
        this.pureDamagePool = 0
        this.physicalDamagePool = 0
        this.magicalDamagePool = 0
    }

    GetModifierAvoidDamage(event: ModifierAttackEvent): number {
        const parent = this.GetParent()
        if(event.target != parent) return 0;
        if(event.inflictor == this.GetAbility()) return 0;

        this.lastAttacker = event.attacker
        if(event.damage_type == DamageTypes.MAGICAL) {
            this.magicalDamagePool += event.original_damage
        } else if(event.damage_type == DamageTypes.PHYSICAL) {
            this.physicalDamagePool += event.original_damage
        } else {
            this.pureDamagePool += event.original_damage
        }

        return 1        
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        let duration = getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], parent) * this.delayDuratioFactor;
        
        if(duration < this.damageInterval) {
            duration = this.damageInterval
        }

        const physicalDamage = Math.floor(this.physicalDamagePool / (duration / this.damageInterval))
        this.physicalDamagePool -= physicalDamage;

        if(physicalDamage > 0) {
            ApplyDamage({
                victim: parent,
                attacker: this.lastAttacker,
                damage: physicalDamage,
                damage_type: DamageTypes.PHYSICAL,
                ability: this.GetAbility()
            })
        }
        
        const magicalDamage = Math.floor(this.magicalDamagePool / (duration / this.damageInterval))
        this.magicalDamagePool -= magicalDamage;

        if(magicalDamage > 0) {
            ApplyDamage({
                victim: parent,
                attacker: this.lastAttacker,
                damage: magicalDamage,
                damage_type: DamageTypes.MAGICAL,
                ability: this.GetAbility()        
            })
        }
        

        const pureDamage = Math.floor(this.pureDamagePool / (duration / this.damageInterval))
        this.pureDamagePool -= pureDamage;

        if(pureDamage > 0) {
            ApplyDamage({
                victim: parent,
                attacker: this.lastAttacker,
                damage: pureDamage,
                damage_type: DamageTypes.PURE,
                ability: this.GetAbility()        
            })
        }        
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_oracle/oracle_ambient_armor.vpcf'
    }

    IsPurgable(): boolean {
        return false
    }
}