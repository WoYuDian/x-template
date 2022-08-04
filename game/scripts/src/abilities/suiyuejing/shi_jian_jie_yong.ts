import { getSumOfForceOfRuleLevels } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_jie_yong } from "../../modifiers/suiyuejing/shi_jian_jie_yong";

@registerAbility()
export class shi_jian_jie_yong extends BaseAbility
{
    OnSpellStart(): void {


        const caster = this.GetCaster();

        caster.AddNewModifier(caster, this, modifier_shi_jian_jie_yong.name, {duration: this.GetSpecialValueFor('duration')})
        this.StartCooldown(Math.floor(this.GetSpecialValueFor('point_factor') * getSumOfForceOfRuleLevels(['metal', 'rock', 'water', 'wood', 'fire'], this.GetCaster())))
    }
}