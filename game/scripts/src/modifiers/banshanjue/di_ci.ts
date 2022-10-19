


import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { calcDistanceOfTwoPoint } from "../../util";
import { Timers } from "../../lib/timers";
import { modifier_move } from "../common/modifier_move";
@registerModifier()
export class modifier_di_ci extends BaseModifier {
    particleId: ParticleID
    healthFactor: number = 0
    forceOfRock: number = 0
    rockResistance: number = 0
    size: number = 0
    splitNum: number = 0
    healthPercentagea: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        this.GetParent().SetMoveCapability(UnitMoveCapability.GROUND)
        this.healthFactor = this.GetAbility().GetSpecialValueFor('health_factor')
        this.forceOfRock = getForceOfRuleLevel('rock', this.GetAbility().GetCaster())
        this.rockResistance = this.GetAbility().GetSpecialValueFor('rock_resistance')
        this.splitNum = this.GetAbility().GetSpecialValueFor('split_num')
        this.size = params.size || 3;
        this.healthPercentagea = this.size == 3? 1: this.size == 2? 0.5: 0.25
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            healthFactor: this.healthFactor,
            forceOfRock: this.forceOfRock,
            rockResistance: this.rockResistance,
            splitNum: this.splitNum,
            size: this.size,
            healthPercentagea: this.healthPercentagea
        }
    }

    HandleCustomTransmitterData(data) {        
        this.healthFactor = data.healthFactor
        this.forceOfRock = data.forceOfRock
        this.rockResistance = data.rockResistance
        this.size = data.size
        this.splitNum = data.splitNum
        this.healthPercentagea = data.healthPercentagea
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.EXTRA_HEALTH_BONUS, ModifierFunction.MAGICAL_RESISTANCE_BONUS, ModifierFunction.ON_DEATH]
    }

    GetModifierMagicalResistanceBonus(event: ModifierAttackEvent): number {
        return this.GetAbility().GetSpecialValueFor('rock_resistance')    
    }

    GetModifierExtraHealthBonus(): number {
        return this.healthFactor * this.forceOfRock * this.healthPercentagea
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;        
        if(event.unit != this.GetParent()) return; 
        const nFXIndex = ParticleManager.CreateParticle( "particles/di_ci/di_ci_broken.vpcf", ParticleAttachment.POINT, this.GetCaster() ) 
                      
        ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, this.GetParent().GetAbsOrigin(), true )
        ParticleManager.ReleaseParticleIndex( nFXIndex )

        const curPos = this.GetParent().GetAbsOrigin()
        this.GetParent().SetAbsOrigin(Vector(curPos.x, curPos.y, -1000))
        let unitName;
        if(this.size == 3) {
            unitName = 'rock_medium'
        } else if(this.size == 2) {
            unitName = 'rock_small'
        }

        if(!unitName) return;
        
        const caster = this.GetCaster()
        const position = this.GetParent().GetAbsOrigin()
        const ability = this.GetAbility()

        const direction = Vector(RandomFloat(-1, 1), RandomFloat(-1, 1), 0);
        direction.Normalized()

        for(let i = 0; i < this.splitNum; i++) {
            const rock = CreateUnitByName(unitName, 
                //@ts-ignore 0
                position, 
                true, 
                null, 
                PlayerResource.GetPlayer(caster.GetPlayerOwnerID()), 
                caster.GetTeamNumber()
            )    
    
            rock.AddNewModifier(
                caster, 
                ability, 
                modifier_di_ci.name, 
                {size: this.size - 1}
            )


            rock.AddNewModifier(
                caster, 
                ability, 
                modifier_move.name, 
                {
                    duration: 0.1,
                    speed: 2000,
                    direction_x: direction.x * Math.pow(-1, i),
                    direction_y: direction.y * Math.pow(-1, i),
                    direction_z: direction.z * Math.pow(-1, i)
                }
            )
            
            rock.SetControllableByPlayer(caster.GetPlayerOwnerID(), false); 
            rock.SetMoveCapability(UnitMoveCapability.NONE)
        }
    }

    IsDebuff(): boolean {
        return this.GetCaster().GetTeamNumber() == this.GetParent().GetTeamNumber()
    }

    IsPurgable(): boolean {
        return false
    }

    IsHidden(): boolean {
        return true;
    }
}