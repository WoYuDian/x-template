
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { Timers } from "../../lib/timers";
@registerModifier()
export class modifier_fen_tian_zhi_yan extends BaseModifier {
    primaryStateFactor: number = 0
    radius: number = 0
    delay: number = 0
    interval: number = 0
    particle: ParticleID
    location: Vector
    OnCreated(params: any): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.delay = this.GetAbility().GetSpecialValueFor('delay')
        this.interval = this.GetAbility().GetSpecialValueFor('interval')
        this.location = this.GetParent().GetAbsOrigin()

        if(!IsServer()) return;
        const particleStart = ParticleManager.CreateParticle("particles/fen_tian_zhi_yan/fen_tian_zhi_yan_start.vpcf", ParticleAttachment.POINT,this.GetAbility().GetCaster())
        ParticleManager.SetParticleControl(particleStart, 0, this.GetParent().GetAbsOrigin())
        ParticleManager.SetParticleControl(particleStart, 1, this.GetParent().GetAbsOrigin())
        this.AddParticle(particleStart, false, false, -1, false, false)        
        const _this = this
        Timers.CreateTimer(this.delay, function() {
            _this.SetDuration(_this.GetDuration(), true)
            _this.particle = ParticleManager.CreateParticle("particles/units/heroes/hero_jakiro/jakiro_macropyre.vpcf", ParticleAttachment.WORLDORIGIN, _this.GetAbility().GetCaster())
            ParticleManager.SetParticleControl(_this.particle, 0, _this.GetParent().GetAbsOrigin())
            ParticleManager.SetParticleControl(_this.particle, 1, _this.GetParent().GetAbsOrigin())
            ParticleManager.SetParticleControl(_this.particle, 2, Vector(100, 0, 0))
            ParticleManager.SetParticleControl(_this.particle, 3, _this.GetParent().GetAbsOrigin())
            _this.AddParticle(_this.particle, false, false, -1, false, false)
            _this.StartIntervalThink(_this.interval)
        } )

        
    }

    // OnDestroy(): void {
    //     if(!IsServer()) return;
    //     ParticleManager.DestroyParticle(this.particle, false)
	// 	ParticleManager.ReleaseParticleIndex(this.particle)
    // }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.delay = this.GetAbility().GetSpecialValueFor('delay')
        this.interval = this.GetAbility().GetSpecialValueFor('interval')
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const caster = this.GetAbility().GetCaster()
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            this.location, 
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
                attacker: caster,
                damage: this.primaryStateFactor * getForceOfRuleLevel('fire', caster),
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