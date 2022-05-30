import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { createUnitCompositionInJungle} from '../../game_logic/game_operation'
@registerAbility()
export class summon_zombie extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
        const zombieNum = this.GetLevelSpecialValueFor('zombie_num', this.GetLevel() - 1)
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

    IsHidden(): boolean {
        return false
    }

}