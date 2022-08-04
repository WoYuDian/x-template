import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_jian_jia_su } from "../../modifiers/suiyuejing/shi_jian_jia_su"

@registerAbility()
export class shi_jian_jia_su extends BaseAbility
{
    OnSpellStart(): void {
        const caster = this.GetCaster();

        caster.AddNewModifier(caster, this, modifier_shi_jian_jia_su.name, {duration: this.GetSpecialValueFor('duration')})
    }
}