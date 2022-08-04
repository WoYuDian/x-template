import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_she_hun_lian_yu } from "../../modifiers/necromancer_collection/she_hun_lian_yu";

@registerAbility()
export class she_hun_lian_yu extends BaseAbility
{
    spellSucceed: boolean = false
    OnSpellStart(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()

        if(caster.FindModifierByName(modifier_she_hun_lian_yu.name)) {
            caster.RemoveModifierByName(modifier_she_hun_lian_yu.name)
        } else {
            caster.AddNewModifier(caster, this, modifier_she_hun_lian_yu.name, {})
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
        const modifier = caster.FindModifierByName(modifier_she_hun_lian_yu.name) as modifier_she_hun_lian_yu
        if(!modifier) return;

        if(interrupted) {
            caster.RemoveModifierByName(modifier_she_hun_lian_yu.name)
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
