
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { forceOfRuleMap, getRuleNamesOfUnit, getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
import { calcDistanceOfTwoPoint } from "../../util";
@registerModifier()
export class modifier_shi_jian_jian_shi extends BaseModifier {
    distanceFactor: number
    damageInterval: number
    forceOfRule: number
    damageFactor: number
    location: Vector
    particleId: ParticleID
    OnCreated(params: any): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        parent.SetMoveCapability(UnitMoveCapability.GROUND)
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.forceOfRule = getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], this.GetCaster())
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.distanceFactor = this.GetAbility().GetSpecialValueFor('distance_factor')
        this.location = parent.GetAbsOrigin()
        
        this.particleId = ParticleManager.CreateParticle( "particles/shi_jian_jian_shi/shi_jian_jian_shi.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( this.particleId, 1, parent, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )
        //@ts-ignore
        ParticleManager.SetParticleControl(this.particleId, 3, parent.GetAbsOrigin())
        this.AddParticle(this.particleId, false, false, -1, false, false)

        this.StartIntervalThink(this.damageInterval)
    }

    OnRefresh(params: object): void {
    }

    OnDestroy(): void {
        if(!IsServer()) return
        const parent = this.GetParent()
        parent.SetAbsOrigin(this.location)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        const parent = this.GetParent()
        const damage = this.damageFactor * this.forceOfRule * (this.distanceFactor * calcDistanceOfTwoPoint(parent.GetAbsOrigin(), this.location) + 1)

        ApplyDamage({
            victim: parent,
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            ability: this.GetAbility()
        })
    }

    IsPurgable(): boolean {
        return false
    }
}