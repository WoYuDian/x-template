import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_dui_ji } from "../../modifiers/suiyuejing/shi_jian_dui_ji"
import { modifier_shi_jian_dui_ji_debuff } from "../../modifiers/suiyuejing/shi_jian_dui_ji_debuff";

@registerAbility()
export class shi_jian_dui_ji extends BaseAbility
{
    OnSpellStart(): void {

        const caster = this.GetCaster()
        const enemies = FindUnitsInRadius(
            caster.GetTeamNumber(), 
            caster.GetAbsOrigin(), 
            null, 
            this.GetSpecialValueFor('radius'), 
            UnitTargetTeam.ENEMY, 
            UnitTargetType.BASIC + UnitTargetType.HERO, 
            UnitTargetFlags.NONE,
            FindOrder.ANY,
            false)

        for(const enemy of enemies) {
            const modifier = enemy.FindModifierByName(modifier_shi_jian_dui_ji_debuff.name)
            if(modifier) {
                modifier.Destroy()
            }
        }
    }

    GetIntrinsicModifierName(): string {
        return modifier_shi_jian_dui_ji.name
    }
}