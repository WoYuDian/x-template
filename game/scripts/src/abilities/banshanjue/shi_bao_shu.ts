import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_shi_bao_shu } from "../../modifiers/banshanjue/shi_bao_shu" 

@registerAbility()
export class shi_bao_shu extends BaseAbility
{
    GetIntrinsicModifierName(): string {
        return modifier_shi_bao_shu.name
    }
}