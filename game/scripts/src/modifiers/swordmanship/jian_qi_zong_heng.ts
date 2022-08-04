import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";

@registerModifier()
export class modifier_jian_qi_zong_heng extends BaseModifier {
    damageFactor: number = 0
    radius: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')

        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent();
        const units = FindUnitsInRadius(
            parent.GetTeamNumber(), 
            parent.GetAbsOrigin(), 
            null, 
            this.radius, 
            UnitTargetTeam.FRIENDLY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        const swords = [parent]
        for(const unit of units) {
            if(unit.GetUnitName() == 'ju_jian_shu_unit') {
                swords.push(unit)
            }
        }

        if(swords.length > 1) {
            const damage = this.damageFactor * getForceOfRuleLevel('metal', parent)
            for(let i = 0; i < swords.length; i++) {
                const sword = swords[i];
                let randomIndex = RandomInt(0, swords.length - 1)

                if(randomIndex == i) {
                    if((i + 1) < swords.length) {
                        randomIndex = i + 1
                    } else {
                        randomIndex = i - 1
                    }
                }

                const startPos = sword.GetAbsOrigin();
                const endPos = swords[randomIndex].GetAbsOrigin()
                const enemies = FindUnitsInLine(
                    parent.GetTeamNumber(),
                    startPos,
                    endPos,
                    null,
                    50,
                    UnitTargetTeam.ENEMY,
                    UnitTargetType.BASIC + UnitTargetType.HERO,
                    UnitTargetFlags.NONE)
                
                for(const enemy of enemies) {
                    ApplyDamage({
                        victim: enemy,
                        attacker: parent,
                        damage: damage,
                        damage_type: DamageTypes.PURE,
                        ability: this.GetAbility()        
                    })
                }

                const particle = ParticleManager.CreateParticle( "particles/econ/items/templar_assassin/templar_assassin_focal/ta_focal_psi_blade.vpcf", ParticleAttachment.CUSTOMORIGIN_FOLLOW, sword)
                ParticleManager.SetParticleControlEnt( particle, 0, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', sword.GetAbsOrigin(), true )
                ParticleManager.SetParticleControlEnt( particle, 1, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', swords[randomIndex].GetAbsOrigin(), true )
                ParticleManager.ReleaseParticleIndex( particle )
            }
        }        
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;

        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.radius = this.GetAbility().GetSpecialValueFor('radius')
    }



    IsPurgable(): boolean {
        return false
    }    
}