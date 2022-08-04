import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_jian_qi_zong_heng } from "../../modifiers/swordmanship/jian_qi_zong_heng"

@registerAbility()
export class jian_qi_zong_heng extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_jian_qi_zong_heng.name
    }
}