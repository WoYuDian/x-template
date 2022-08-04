
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_wu_jin_lei_yu extends BaseModifier {
    succeed: boolean = false
    damageFactor: number = 0
    damageInterval: number = 0
    forceOfRulePerAttack: number = 0
    manaCostPerWave: number = 0
    baseAttackNum: number = 0
    searchRadius: number = 0
    cores: {id: ParticleID, position: Vector}[] = []
    particle: ParticleID
    OnCreated(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.forceOfRulePerAttack = this.GetAbility().GetSpecialValueFor('force_of_rule_per_attack')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.baseAttackNum = this.GetAbility().GetSpecialValueFor('base_attack_num')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')

        if(!IsServer()) return;
        const caster = this.GetAbility().GetCaster()
        this.particle = ParticleManager.CreateParticle("particles/wu_jin_lei_yu/wu_jin_lei_yu_cloud.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW,caster)
        ParticleManager.SetParticleControl(this.particle, 0, caster.GetAbsOrigin())
        ParticleManager.SetParticleControl(this.particle, 1, Vector(3, 0 , 0))
        // this.AddParticle(particleStart, false, false, -1, false, false)      
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particle, false)
		ParticleManager.ReleaseParticleIndex(this.particle)
    }

    OnRefresh(params: object): void {
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.forceOfRulePerAttack = this.GetAbility().GetSpecialValueFor('force_of_rule_per_flower')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.baseAttackNum = this.GetAbility().GetSpecialValueFor('base_attack_num')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')
    }

    spellSucceed() {
        this.succeed = true;
        const caster = this.GetAbility().GetCaster();
        const flowerNum = Math.floor(getForceOfRuleLevel('metal', caster) / this.forceOfRulePerAttack) + this.baseAttackNum
        const radius = 150;
        const fowardDirection = caster.GetForwardVector().Normalized()

        for(let i = 0; i < flowerNum; i++) {
            const angle = Math.PI * 2 * i / flowerNum

            const position = Vector(math.cos(angle) * fowardDirection.x - fowardDirection.y * Math.sin(angle), fowardDirection.x * Math.sin(angle) + fowardDirection.y * Math.cos(angle), 0) * radius
            //@ts-ignore 
            position.z = 300
           
            //@ts-ignore 
            this.cores.push({position: position as Vector})
        }

        this.StartIntervalThink(this.damageInterval)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        if(this.manaCostPerWave > this.GetParent().GetMana()) {
            this.GetParent().RemoveModifierByName(modifier_wu_jin_lei_yu.name)
            return;
        } else {
            this.GetParent().ReduceMana(this.manaCostPerWave)
        }
        
        const caster = this.GetCaster()
        const damage = this.damageFactor * getForceOfRuleLevel('fire', caster)
        for(const core of this.cores) {
            //@ts-ignore
            const enemies = FindUnitsInRadius(
                caster.GetTeamNumber(), 
                //@ts-ignore
                caster.GetAbsOrigin() + core.position, 
                null, 
                this.searchRadius, 
                UnitTargetTeam.ENEMY, 
                UnitTargetType.BASIC + UnitTargetType.HERO, 
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false)
            if(enemies[0]) {
                const nFXIndex = ParticleManager.CreateParticle( "particles/wu_jin_lei_yu/wu_jin_lei_yu_strike.vpcf", ParticleAttachment.POINT, caster )
                //@ts-ignore
                // ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', caster.GetAbsOrigin() + core.position, true )
                // ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT_FOLLOW, 'attach_hitloc', enemies[0].GetAbsOrigin(), true )
                ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, caster.GetAbsOrigin() + core.position, true )
                ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, enemies[0].GetAbsOrigin(), true )
                ParticleManager.ReleaseParticleIndex( nFXIndex )
            }

            ApplyDamage({
                victim: enemies[0],
                attacker: caster,
                damage: damage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this.GetAbility()
            })
        }
    }
}