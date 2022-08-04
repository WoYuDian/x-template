
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { forceOfRuleMap, getRuleNamesOfUnit, getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
import { calcDistanceOfTwoPoint } from "../../util";
@registerModifier()
export class modifier_shi_jian_jie_yong extends BaseModifier {
    pointFactor: number
    forceOfRule: number
    point: number
    particleId: ParticleID
    abilities: CDOTABaseAbility[] = []
    OnCreated(params: any): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        parent.SetMoveCapability(UnitMoveCapability.GROUND)
        this.pointFactor = this.GetAbility().GetSpecialValueFor('point_factor')
        this.forceOfRule = getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], this.GetCaster())
        this.point = Math.floor(this.pointFactor * this.forceOfRule)
        this.SetStackCount(this.point)
        
        for(let i = 0; i < 32; i++) {
            const abilitiy = parent.GetAbilityByIndex(i)
            
            if(abilitiy && (abilitiy.GetName() != this.GetAbility().GetName())) {
                this.abilities.push(abilitiy)
            }
        }    
        this.particleId = ParticleManager.CreateParticle( "particles/econ/items/invoker/invoker_ti7/invoker_ti7_alacrity_buff.vpcf", ParticleAttachment.OVERHEAD_FOLLOW, parent )
        //@ts-ignore
        ParticleManager.SetParticleControlEnt( this.particleId, 0, parent, ParticleAttachment.OVERHEAD_FOLLOW, 'attach_hitloc', parent.GetAbsOrigin(), true )
        //@ts-ignore
        this.AddParticle(this.particleId, false, false, -1, false, false)

        this.StartIntervalThink(0.5)
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        
        for(const ability of this.abilities) {            
            if(!ability.IsCooldownReady()) {
                const cost = ability.GetCooldownTimeRemaining()
                const curPoint = this.GetStackCount()

                if(cost > curPoint) {
                    this.SetStackCount(0)
                    ability.EndCooldown()
                    ability.StartCooldown(cost - curPoint)
                    this.Destroy()
                    break;
                } else {
                    this.SetStackCount(curPoint - cost)
                    ability.EndCooldown()
                }

                const nFXIndex = ParticleManager.CreateParticle( "particles/shi_jian_jie_yong/shi_jian_jie_yong.vpcf", ParticleAttachment.POINT, parent )
                //@ts-ignore
                ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, parent.GetAbsOrigin(), true )
                //@ts-ignore
                ParticleManager.ReleaseParticleIndex( nFXIndex )
            }
        }
    }

    OnRefresh(params: object): void {
    }

    IsPurgable(): boolean {
        return false
    }
}