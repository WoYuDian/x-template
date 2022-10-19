
import { rollDrops } from "../../game_logic/game_operation";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_di_ci } from "./di_ci";
@registerModifier()
export class modifier_shi_bao_shu_buff extends BaseModifier {
    // damageFactor: number = 0
    // baseSizeFactor: number = 0
    // forceOfRock: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        // this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        // this.forceOfRock = getForceOfRuleLevel('rock', this.GetAbility().GetCaster())
        // this.baseSizeFactor = this.GetAbility().GetSpecialValueFor('base_size_factor')
        // this.SetHasCustomTransmitterData(true)
        // this.SendBuffRefreshToClients()
    }

    // OnRefresh(params: object): void {
    //     if(!IsServer()) return;
    //     this.OnCreated({})
    //     this.SendBuffRefreshToClients()
    // }

    // AddCustomTransmitterData() {
    //     return {
    //         damageFactor: this.damageFactor,
    //         forceOfRock: this.forceOfRock,
    //         baseSizeFactor: this.baseSizeFactor,
    //     }
    // }

    // HandleCustomTransmitterData(data) {        
    //     this.damageFactor = data.damageFactor
    //     this.forceOfRock = data.forceOfRock
    //     this.baseSizeFactor = data.baseSizeFactor
    // }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;        
        if(event.unit != this.GetParent()) return;
        if(event.unit.GetUnitName().indexOf('rock') < 0) return;
        const modifierDiCi = event.unit.FindModifierByName(modifier_di_ci.name) as modifier_di_ci;

        if(!modifierDiCi) return;
        
        const size = modifierDiCi.size || 1;
        const ability = this.GetAbility()
        const caster = this.GetCaster()
        const damage = ability.GetSpecialValueFor('damage_factor') * ability.GetSpecialValueFor('base_size_factor') * Math.pow(2, size - 1) *  getForceOfRuleLevel('rock', caster)

        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            this.GetParent().GetAbsOrigin(), 
            null, 
            ability.GetSpecialValueFor('blast_radius'), 
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
                ability: ability
            })
        }
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}