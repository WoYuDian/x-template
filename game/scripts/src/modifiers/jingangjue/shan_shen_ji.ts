
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_shan_shen_ji extends BaseModifier {
    radius: number
    damageFactor: number
    position: Vector
    OnCreated(params: any): void {
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        if(!IsServer()) return;
        this.GetParent().AddNoDraw()
        this.position = Vector(params.pos_x, params.pos_y, params.pos_z);
    }

    OnRefresh(params: object): void {
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
    }

    OnDestroy(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        const damage = this.damageFactor * (getForceOfRuleLevel('body', parent) + getForceOfRuleLevel('meatl', parent))
        parent.RemoveNoDraw()

        parent.SetAbsOrigin(this.position)
        const enemies = FindUnitsInRadius(
            parent.GetTeamNumber(), 
            parent.GetAbsOrigin(), 
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
                damage_type: DamageTypes.PHYSICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }

        const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_marci/marci_unleash_cast_rings.vpcf", ParticleAttachment.POINT, parent )
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.OUT_OF_GAME]: true,
            [ModifierState.INVULNERABLE]: true,
            [ModifierState.STUNNED]: true
        }
    }

    IsPurgable(): boolean {
        return false
    }
}