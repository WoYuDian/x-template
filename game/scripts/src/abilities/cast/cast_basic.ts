import { getUnitFirstItem } from "../../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
@registerAbility()
export class cast_basic extends BaseAbility
{    
    conditions: {[attribute: string]: number} = {}
    Spawn(): void {
        if(!IsServer()) return

        this.SetLevel(1)
        this.conditions.toughness = this.GetSpecialValueFor('toughness')
        this.conditions.hardness = this.GetSpecialValueFor('hardness')
        this.conditions.weight = this.GetSpecialValueFor('weight')
    }

    checkCondition() {
        if(!IsServer()) return;

        const caster = this.GetCaster()

        const item = getUnitFirstItem(caster)

        if(!item) return false

        if((item.hardness < this.conditions.hardness) ||
           (item.toughness < this.conditions.toughness) || 
           (item.weight < this.conditions.weight)) {
            return false;
        } else {
            return true
        }
    }
}
