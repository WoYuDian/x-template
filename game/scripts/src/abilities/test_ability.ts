import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter"

@registerAbility()
export class test_ability extends BaseAbility
{
    OnSpellStart(): void {
        print('herere++++++++++++')
    }
}