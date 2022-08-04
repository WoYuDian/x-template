import { getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_ling_yu } from "../../modifiers/suiyuejing/shi_jian_ling_yu";


@registerAbility()
export class shi_jian_ling_yu extends BaseAbility
{
    OnSpellStart(): void {


        const caster = this.GetCaster();

        const duration = this.GetSpecialValueFor('duration_factor') * getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], caster)
        caster.AddNewModifier(caster, this, modifier_shi_jian_ling_yu.name, {duration: duration})
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('radius')
    }
}