
import { rollDrops } from "../../game_logic/game_operation";
import { BaseAbility, BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { modifier_generic_orb_effect } from "../modifier_generic_orb_effect";
import { Timers } from "../../lib/timers";
@registerModifier()
export class modifier_common_ai extends BaseModifier {
    abilities: CDOTABaseAbility[] = []
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.StartIntervalThink(1)

        const parent = this.GetParent()
        for(let i = 0; i < 32; i++) {
            const abilitiy = parent.GetAbilityByIndex(i)
            if(!abilitiy || abilitiy.IsNull()) continue;
            abilitiy.SetLevel(abilitiy.GetMaxLevel())
            this.abilities.push(abilitiy)
        }    
    }


    OnIntervalThink(): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        if(parent.IsChanneling()) return;

        for(const ability of this.abilities) {
            if(ability.IsPassive()) continue;
            //@ts-ignore
            if(ability.spellSucceed) continue;
            if(ability.GetToggleState()) continue;
            if(ability.IsCooldownReady()) {
                let team = ability.GetAbilityTargetTeam()
                team = team == UnitTargetTeam.NONE? UnitTargetTeam.ENEMY: team
                const behavior = ability.GetBehaviorInt()
                const units = FindUnitsInRadius(
                    parent.GetTeamNumber(), 
                    parent.GetAbsOrigin(), 
                    null, 
                    1000, 
                    team, 
                    UnitTargetType.BASIC + UnitTargetType.HERO, 
                    UnitTargetFlags.NONE,
                    FindOrder.ANY,
                    false)
                
                const target = units[0]

                if(ability.IsToggle()) {
                    ability.ToggleAbility()
                    return;
                } else if(((behavior & AbilityBehavior.POINT) > 0) && target) {
                    parent.CastAbilityOnPosition(target.GetAbsOrigin(), ability, 0)
                    return;
                } else if((behavior & AbilityBehavior.NO_TARGET) > 0) {
                    parent.CastAbilityNoTarget(ability, 0)
                    return;
                } else if(((behavior & AbilityBehavior.UNIT_TARGET) > 0) && target) {
                    parent.CastAbilityOnTarget(target, ability, 0)
                    return;
                }
            }
        }
    }

    IsHidden(): boolean {
        return true
    }
}