
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_fu_shen } from "./fu_shen";

@registerModifier()
export class modifier_fu_shen_buff extends BaseModifier {
    healthFactor: number
    damageFactor: number
    moveSpeedFactor: number
    attackSpeedFactor: number
    forceOfRule: number
    particleId: ParticleID
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const caster = this.GetCaster();
        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.healthFactor = this.GetAbility().GetSpecialValueFor('health_factor')
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.moveSpeedFactor = this.GetAbility().GetSpecialValueFor('move_speed_factor')
        this.attackSpeedFactor = this.GetAbility().GetSpecialValueFor('attack_speed_factor')
        this.forceOfRule = getForceOfRuleLevel('rock', caster) + getForceOfRuleLevel('spirit', caster)
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()

        this.StartIntervalThink(FrameTime())

        this.particleId = ParticleManager.CreateParticle( "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit_icon.vpcf", ParticleAttachment.OVERHEAD_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( this.particleId, 0, null, ParticleAttachment.OVERHEAD_FOLLOW, null, this.GetParent().GetAbsOrigin(), true )
        ParticleManager.SetParticleControlEnt( this.particleId, 1, null, ParticleAttachment.OVERHEAD_FOLLOW, null, this.GetParent().GetAbsOrigin(), true )
    }
    
    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
		ParticleManager.ReleaseParticleIndex(this.particleId)

        const parent = this.GetParent()
        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_life_stealer/life_stealer_infest_emerge_clean.vpcf", ParticleAttachment.POINT, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        this.GetCaster().SetAbsOrigin(this.GetParent().GetAbsOrigin())
    }

    AddCustomTransmitterData() {
        return {
            healthFactor: this.healthFactor,
            damageFactor: this.damageFactor,
            moveSpeedFactor: this.moveSpeedFactor,
            attackSpeedFactor: this.attackSpeedFactor,
            forceOfRule: this.forceOfRule
        }
    }

    HandleCustomTransmitterData(data) {        
        this.healthFactor = data.healthFactor
        this.damageFactor = data.damageFactor
        this.moveSpeedFactor = data.moveSpeedFactor
        this.attackSpeedFactor = data.attackSpeedFactor
        this.forceOfRule = data.forceOfRule
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.PREATTACK_BONUS_DAMAGE, 
            ModifierFunction.ATTACKSPEED_BONUS_CONSTANT, 
            ModifierFunction.EXTRA_HEALTH_BONUS, 
            ModifierFunction.MODEL_SCALE,
            ModifierFunction.MOVESPEED_BONUS_CONSTANT,
            ModifierFunction.ON_DEATH
        ]        
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            // [ModifierState.NO_UNIT_COLLISION]: true
        }
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        if(event.unit != this.GetParent()) return;

        this.GetCaster().RemoveModifierByName(modifier_fu_shen.name)
    }

    GetModifierPreAttack_BonusDamage(): number {
        return this.damageFactor * this.forceOfRule
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackSpeedFactor * this.forceOfRule
    }

    GetModifierExtraHealthBonus(): number {
        return this.healthFactor * this.forceOfRule
    }

    GetModifierMoveSpeedBonus_Constant(): number {
        return this.moveSpeedFactor * this.forceOfRule
    }

    GetModifierModelScale(): number {
        return 50
    }
}