


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";

@registerModifier()
export class modifier_shi_jian_jia_su extends BaseModifier {
    forceOfRuleLevelPerAttack: number
    baseAttack: number
    attackSpeed: number
    forceOfRule: number
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.forceOfRuleLevelPerAttack = this.GetAbility().GetSpecialValueFor('force_of_rule_level_per_attack')
        this.forceOfRule = getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], this.GetParent())
        this.baseAttack = this.GetAbility().GetSpecialValueFor('base_attack')
        this.attackSpeed = this.GetAbility().GetSpecialValueFor('attack_speed')
        this.SetStackCount(this.baseAttack + Math.ceil(this.forceOfRule / this.forceOfRuleLevelPerAttack))
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()

        const caster = this.GetCaster()
        const particle = ParticleManager.CreateParticle('particles/units/heroes/hero_ursa/ursa_overpower_buff.vpcf', ParticleAttachment.CUSTOMORIGIN, caster)
		ParticleManager.SetParticleControlEnt(particle, 0, caster, ParticleAttachment.POINT_FOLLOW, "attach_head", caster.GetAbsOrigin(), true)
		ParticleManager.SetParticleControlEnt(particle, 1, caster, ParticleAttachment.POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
		ParticleManager.SetParticleControlEnt(particle, 2, caster, ParticleAttachment.POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
		ParticleManager.SetParticleControlEnt(particle, 3, caster, ParticleAttachment.POINT_FOLLOW, "attach_hitloc", caster.GetAbsOrigin(), true)
		this.AddParticle(particle, false, false, -1, false, false)
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            forceOfRuleLevelPerAttack: this.forceOfRuleLevelPerAttack,
            forceOfRule: this.forceOfRule,
            baseAttack: this.baseAttack,
            attackSpeed: this.attackSpeed,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.forceOfRuleLevelPerAttack = data.forceOfRuleLevelPerAttack
        this.forceOfRule = data.forceOfRule
        this.baseAttack = data.baseAttack
        this.attackSpeed = data.attackSpeed
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, ModifierFunction.ON_ATTACK]
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackSpeed
    }

    OnAttack(event: ModifierAttackEvent): void {
        const caster = this.GetCaster()
        if(event.attacker != caster) return;

        const curStack = this.GetStackCount()

        if(curStack > 1) {
            this.DecrementStackCount()
        } else {
            this.Destroy()
        }
    }

    GetEffectName(): string {
        return 'particles/status_fx/status_effect_overpower.vpcf'
    }
}