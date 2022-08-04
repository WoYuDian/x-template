
import { rollDrops } from "../../game_logic/game_operation";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_generic_orb_effect } from "../modifier_generic_orb_effect";
@registerModifier()
export class modifier_shan_yue_zhi_li_buff extends BaseModifier {
    // damageFactor: number = 0
    // baseSizeFactor: number = 0
    // forceOfRock: number = 0
    OnCreated(params: any): void {
        if(!IsServer()) return;

        // this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
        // this.forceOfRock = getForceOfRuleLevel('rock', this.GetAbility().GetCaster())
        // this.baseSizeFactor = this.GetAbility().GetSpecialValueFor('base_size_factor')
        // this.SetHasCustomTransmitterData(true)
        // this.SendBuffRefreshToClients()
    }

    // OnRefresh(params: object): void {
    //     if(!IsServer()) return;
    //     this.OnCreated({})
    //     this.SendBuffRefreshToClients()
    // }

    // AddCustomTransmitterData() {
    //     return {
    //         damageFactor: this.damageFactor,
    //         forceOfRock: this.forceOfRock,
    //         baseSizeFactor: this.baseSizeFactor,
    //     }
    // }

    // HandleCustomTransmitterData(data) {        
    //     this.damageFactor = data.damageFactor
    //     this.forceOfRock = data.forceOfRock
    //     this.baseSizeFactor = data.baseSizeFactor
    // }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;        
        if(event.unit != this.GetParent()) return;
        if(event.unit.GetTeamNumber() != this.GetCaster().GetTeamNumber()) return;
        if(event.unit.GetUnitName().indexOf('rock') < 0) return;

        const sourceLoc = this.GetParent().GetAbsOrigin()
        sourceLoc.z = 50
        ProjectileManager.CreateTrackingProjectile({
            //@ts-ignore
            vSourceLoc: sourceLoc,
            Target: this.GetCaster(),
            Ability: this.GetAbility(),
            EffectName: 'particles/shan_yue_zhi_li/shan_yue_zhi_li_energy_ball.vpcf',
            bDodgeable: false,
            bProvidesVision: true,
            iMoveSpeed: 1000,
            iVisionRadius: 300,
            iVisionTeamNumber: this.GetCaster().GetTeamNumber(),            
        })
    }
}