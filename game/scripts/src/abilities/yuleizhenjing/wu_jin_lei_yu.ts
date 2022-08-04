import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_wu_jin_lei_yu } from "../../modifiers/yuleizhenjing/wu_jin_lei_yu"

@registerAbility()
export class wu_jin_lei_yu extends BaseAbility
{
    spellSucceed: boolean = false
    OnSpellStart(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()

        if(caster.FindModifierByName(modifier_wu_jin_lei_yu.name)) {
            caster.RemoveModifierByName(modifier_wu_jin_lei_yu.name)
        } else {
            caster.AddNewModifier(caster, this, modifier_wu_jin_lei_yu.name, {})
            this.spellSucceed = false
        }
        

    }

    OnChannelFinish(interrupted: boolean): void {
        if(interrupted) {
            this.spellSucceed = false;
        } else {
            this.spellSucceed = true;
        }

        if(!IsServer()) return;

        const caster = this.GetCaster()
        const modifier = caster.FindModifierByName(modifier_wu_jin_lei_yu.name) as modifier_wu_jin_lei_yu
        if(!modifier) return;

        if(interrupted) {
            caster.RemoveModifierByName(modifier_wu_jin_lei_yu.name)
        } else {
            modifier.spellSucceed()
        }
    }

    GetChannelTime(): number {
        const caster = this.GetCaster()
        if(this.spellSucceed) {
            return 0
        } else {
            return this.GetSpecialValueFor('prepare_time')
        }
        
    }
}
