
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_lei_dian_zhi_chu extends BaseModifier {
    damageFactor: number = 0
    maxStack: number = 0
    stackSpeedFactor: number = 0
    radius: number = 0
    OnCreated(params: any): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack');
        this.stackSpeedFactor = this.GetAbility().GetSpecialValueFor('stack_speed_factor');
        this.radius = this.GetAbility().GetSpecialValueFor('radius');

        if(!IsServer()) return;

        this.SetStackCount(0);
        this.StartIntervalThink(1)
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor');
        this.maxStack = this.GetAbility().GetSpecialValueFor('max_stack');
        this.stackSpeedFactor = this.GetAbility().GetSpecialValueFor('stack_speed_factor');
        this.radius = this.GetAbility().GetSpecialValueFor('radius');
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        const increment = Math.ceil(getForceOfRuleLevel('metal', parent) * this.stackSpeedFactor)

        let stack = this.GetStackCount() + increment

        if(stack > this.maxStack) {
            stack = this.maxStack
        }

        this.SetStackCount(stack)
    }

    GetEffectName(): string {
        return 'particles/units/heroes/hero_stormspirit/stormspirit_overload_ambient.vpcf'
    }


    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK_LANDED]
    }

    OnAttackLanded(event: ModifierAttackEvent): void {
        if(!IsServer()) return;
        const parent = this.GetParent();    
        if(event.attacker != parent) return;

        const stackCount = this.GetStackCount()    
        if(stackCount < 1) return;

        const damage = this.damageFactor * getForceOfRuleLevel('fire', parent) * this.GetStackCount()

        const enemies = FindUnitsInRadius(
            parent.GetTeamNumber(), 
            event.target.GetAbsOrigin(), 
            null, 
            this.radius, 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        for(const enemy of enemies) {
            ApplyDamage({
                victim: enemy,
                attacker: parent,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }


        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_stormspirit/stormspirit_overload_discharge.vpcf", ParticleAttachment.POINT, event.target )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, event.target, ParticleAttachment.POINT, null, event.target.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )
        this.SetStackCount(0)
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true
    }
}