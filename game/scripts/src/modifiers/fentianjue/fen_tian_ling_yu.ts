
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_fen_tian_ling_yu extends BaseModifier {
    succeed: boolean = false
    primaryStateFactor: number = 0
    damageInterval: number = 0
    forceOfRulePerFlower: number = 0
    manaCostPerWave: number = 0
    baseFlowerNum: number = 0
    searchRadius: number = 0
    flowers: {id: ParticleID, position: Vector}[] = []
    particle: ParticleID
    flowerParticle: ParticleID
    OnCreated(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.forceOfRulePerFlower = this.GetAbility().GetSpecialValueFor('force_of_rule_per_flower')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.baseFlowerNum = this.GetAbility().GetSpecialValueFor('base_flower_num')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')

        if(!IsServer()) return;
        const caster = this.GetAbility().GetCaster()
        this.particle = ParticleManager.CreateParticle("particles/fen_tian_ling_yu/fen_tian_ling_yu.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW,caster)
        ParticleManager.SetParticleControl(this.particle, 0, caster.GetAbsOrigin())
        ParticleManager.SetParticleControl(this.particle, 1, Vector(3, 0 , 0))
        // this.AddParticle(particleStart, false, false, -1, false, false)      
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particle, false)
		ParticleManager.ReleaseParticleIndex(this.particle)

        if(this.flowerParticle) {
            ParticleManager.DestroyParticle(this.flowerParticle, false)
		    ParticleManager.ReleaseParticleIndex(this.flowerParticle)
        }
    }

    OnRefresh(params: object): void {
        this.primaryStateFactor = this.GetAbility().GetSpecialValueFor('primary_state_factor')
        this.damageInterval = this.GetAbility().GetSpecialValueFor('damage_interval')
        this.forceOfRulePerFlower = this.GetAbility().GetSpecialValueFor('force_of_rule_per_flower')
        this.manaCostPerWave = this.GetAbility().GetSpecialValueFor('mana_cost_per_wave')
        this.baseFlowerNum = this.GetAbility().GetSpecialValueFor('base_flower_num')
        this.searchRadius = this.GetAbility().GetSpecialValueFor('search_radius')
    }

    spellSucceed() {
        this.succeed = true;
        const caster = this.GetAbility().GetCaster();
        const flowerNum = Math.floor(getForceOfRuleLevel('fire', caster) / this.forceOfRulePerFlower) + this.baseFlowerNum
        const radius = 300;
        const fowardDirection = caster.GetForwardVector().Normalized()

        this.flowerParticle = ParticleManager.CreateParticle("particles/fen_tian_ling_yu/fen_tian_ling_yu_flower.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW,caster)
        ParticleManager.SetParticleControl(this.flowerParticle, 0, caster.GetAbsOrigin())
        ParticleManager.SetParticleControl(this.flowerParticle, 1, Vector(flowerNum, 0 , 0))

        for(let i = 0; i < flowerNum; i++) {
            const angle = Math.PI * 2 * i / flowerNum

            const position = Vector(math.cos(angle) * fowardDirection.x - fowardDirection.y * Math.sin(angle), fowardDirection.x * Math.sin(angle) + fowardDirection.y * Math.cos(angle), 0) * radius

            //@ts-ignore            
            
            this.flowers.push({position: position as Vector})
        }

        this.StartIntervalThink(this.damageInterval)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;
        if(this.manaCostPerWave > this.GetParent().GetMana()) {
            this.GetParent().RemoveModifierByName(modifier_fen_tian_ling_yu.name)
            return;
        } else {
            this.GetParent().ReduceMana(this.manaCostPerWave)
        }
        
        const caster = this.GetCaster()
        for(const flower of this.flowers) {
            //@ts-ignore
            const enemies = FindUnitsInRadius(
                caster.GetTeamNumber(), 
                //@ts-ignore
                caster.GetAbsOrigin() + flower.position, 
                null, 
                this.searchRadius, 
                UnitTargetTeam.ENEMY, 
                UnitTargetType.BASIC + UnitTargetType.HERO, 
                UnitTargetFlags.NONE,
                FindOrder.ANY,
                false)
            if(enemies[0]) {
                ProjectileManager.CreateTrackingProjectile({
                    //@ts-ignore
                    vSourceLoc: caster.GetAbsOrigin() + flower.position,
                    Target: enemies[0],
                    Ability: this.GetAbility(),
                    EffectName: 'particles/fen_tian_ling_yu/fen_tian_ling_yu_projectile.vpcf',
                    bDodgeable: false,
                    bProvidesVision: true,
                    iMoveSpeed: 300,
                    iVisionRadius: 300,
                    iVisionTeamNumber: caster.GetTeamNumber(),
                    
                })
            }
        }
    }    
}