import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { Timers } from "../../lib/timers";
const relatedAbilityList = ['sword_shot', 'sword_sudden']

@registerModifier()
export class modifier_shadow_arrow extends BaseModifier {
    damageFactor: number
    arrowNum: number
    probability: number
    OnCreated(params: object): void {        
        this.damageFactor = - this.GetAbility().GetSpecialValueFor('damage_factor')
        this.arrowNum = this.GetAbility().GetSpecialValueFor('arrow_num')
        this.probability = this.GetAbility().GetSpecialValueFor('probability')
    }

    OnRefresh(params: object): void {
        // if(!IsServer()) return;
        this.damageFactor = - this.GetAbility().GetSpecialValueFor('damage_factor')
        this.arrowNum = this.GetAbility().GetSpecialValueFor('arrow_num')
        this.probability = this.GetAbility().GetSpecialValueFor('probability')
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_ATTACK]
    }    

    OnAttack(event: ModifierAttackEvent): void {
        if(!IsServer()) return;

        if(event.attacker == this.GetParent()) {
            if(RollPercentage(this.probability)) {
                const arrowNum = RandomInt(1, this.arrowNum);
                const target = event.target;
                const _this = this;
                Timers.CreateTimer(0.2, function() {
                    for(let i = 0; i < arrowNum; i++) {
                        ProjectileManager.CreateTrackingProjectile({
                            //@ts-ignore
                            vSourceLoc: _this.GetParent().GetAbsOrigin() + RandomVector(200),
                            Target: target,
                            Ability: _this.GetAbility(),
                            EffectName: 'particles/shadow_arrow/shadow_arrow_projectile.vpcf',
                            bDodgeable: false,
                            bProvidesVision: true,
                            iMoveSpeed: 2000 + RandomInt(-500, 500),
                            iVisionRadius: 300,
                            iVisionTeamNumber: event.attacker.GetTeamNumber()
                        })
    
                    }
                })
            }
        }

    }

    IsHidden(): boolean {
        return false
    }

}