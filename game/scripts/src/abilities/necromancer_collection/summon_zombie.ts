import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { createUnitCompositionInJungle} from '../../game_logic/game_operation'
import { modifier_zombie_augmentation } from "../../modifiers/necromancer_collection/zombie_augmentation";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
@registerAbility()
export class summon_zombie extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const caster = this.GetCaster()
        const zombieNum = this.GetSpecialValueFor('base_zombie_num') + 
            Math.floor((getForceOfRuleLevel('rock', caster) + getForceOfRuleLevel('spirit', caster)) / this.GetSpecialValueFor('force_of_rule_per_zombie'))
        for(let i = 0; i < zombieNum; i++) {
            const unit = CreateUnitByName('npc_necromance_zombie', 
                //@ts-ignore
                this.GetCaster().GetAbsOrigin() + RandomVector(200), 
                true, 
                null, 
                this.GetCaster(), 
                this.GetCaster().GetTeam())

            unit.SetControllableByPlayer(this.GetCaster().GetPlayerOwnerID(), true)
        }
    }

    GetIntrinsicModifierName(): string {
        return modifier_zombie_augmentation.name
    }

    IsHidden(): boolean {
        return false
    }

}