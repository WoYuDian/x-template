import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
@registerAbility()
export class you_ming_ji_dian extends BaseAbility
{    
    curUnit: CDOTA_BaseNPC
    OnSpellStart(): void {                
        // if(IsServer()) {
            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }

            const caster = this.GetCaster();            

            const nFXIndex = ParticleManager.CreateParticle( "particles/you_ming_ji_dian/you_ming_ji_dian_ring.vpcf", ParticleAttachment.POINT, caster )

            ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, vPos, true )
            // ParticleManager.SetParticleControlEnt( nFXIndex, 1, null, ParticleAttachment.POINT, null, vPos, true )
            // ParticleManager.SetParticleControlEnt( nFXIndex, 2, null, ParticleAttachment.POINT, null, vPos, true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
            const summonDelay = this.GetSpecialValueFor('summon_delay')
            if(this.curUnit && !this.curUnit.IsNull() && this.curUnit.IsAlive()) {
                this.curUnit.ForceKill(false)                    
            }
            Timers.CreateTimer(summonDelay, (function() {
                const unit = CreateUnitByName('gui_wang', 
                vPos, 
                true, 
                null, 
                caster, 
                caster.GetTeam())
                this.curUnit = unit

                unit.SetControllableByPlayer(caster.GetPlayerOwnerID(), true)

                const radius = this.GetSpecialValueFor('radius');
                const allies = FindUnitsInRadius(
                    caster.GetTeamNumber(), 
                    vPos, 
                    null, 
                    radius, 
                    UnitTargetTeam.FRIENDLY, 
                    UnitTargetType.BASIC + UnitTargetType.HERO, 
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,
                    false)                        
    
                for(const ally of allies) {
                    if(ally.GetUnitName() == 'npc_necromance_zombie') {
                        ally.AddNewModifier(caster, this, 'modifier_kill', {duration: 0.5})
                    }
                }
            }).bind(this))
           
    }

    GetAOERadius(): number {
        return this.GetSpecialValueFor('radius')
    }

    IsHidden(): boolean {
        return false
    }
}