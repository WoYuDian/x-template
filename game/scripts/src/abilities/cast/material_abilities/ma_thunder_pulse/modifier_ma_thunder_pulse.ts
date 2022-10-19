
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_ma_thunder_pulse extends BaseModifier {
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('damage_interval'))
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        const enemies = FindUnitsInRadius(
            parent.GetTeamNumber(), 
            parent.GetAbsOrigin(), 
            null, 
            500, 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        const forceOfRule = getFabaoSumOfForceOfRuleLevels(['metal', 'fire'], parent)
        const attackNumber = Math.ceil(forceOfRule / 5)
        const damage = forceOfRule * this.GetAbility().GetSpecialValueFor('damage_factor')
        for(let i = 0; i < enemies.length; i++) {
            if(i >= (attackNumber - 1)) {
                break
            }

            // const particle = ParticleManager.CreateParticle( "particles/econ/items/templar_assassin/templar_assassin_focal/ta_focal_psi_blade.vpcf", ParticleAttachment.CUSTOMORIGIN_FOLLOW, enemies[i])
            // ParticleManager.SetParticleControlEnt( particle, 0, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )
            // ParticleManager.SetParticleControlEnt( particle, 1, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', enemies[i].GetAbsOrigin(), true )
            // ParticleManager.ReleaseParticleIndex( particle )
            const nFXIndex = ParticleManager.CreateParticle( "particles/units/heroes/hero_zuus/zuus_arc_lightning.vpcf", ParticleAttachment.POINT, enemies[i] )
            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, enemies[i].GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )

            ApplyDamage({
                victim: enemies[i],
                attacker: parent,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }
    }

    GetEffectName(): string {
        return 'particles/econ/items/razor/razor_fall20_eternal_torturer/razor_fall20_eternal_torturer_belt_gems.vpcf'
    }

    IsHidden(): boolean {
        return true
    }
}
