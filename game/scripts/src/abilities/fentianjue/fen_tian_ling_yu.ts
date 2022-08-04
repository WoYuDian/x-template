import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { modifier_fen_tian_ling_yu } from "../../modifiers/fentianjue/fen_tian_ling_yu"

@registerAbility()
export class fen_tian_ling_yu extends BaseAbility
{
    spellSucceed: boolean = false
    OnSpellStart(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()

        //particles/econ/items/wisp/wisp_relocate_marker_ti7_ring.vpcf
        //particles/items5_fx/revenant_brooch_ring_glow.vpcf
        //particles/ui_mouseactions/range_finder_tp_dest_target_ring.vpcf
        //particles/units/heroes/hero_brewmaster/brewmaster_drunken_stance_fire_ground_ring.vpcf

        if(caster.FindModifierByName(modifier_fen_tian_ling_yu.name)) {
            caster.RemoveModifierByName(modifier_fen_tian_ling_yu.name)
        } else {
            caster.AddNewModifier(caster, this, modifier_fen_tian_ling_yu.name, {})
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
        const modifier = caster.FindModifierByName(modifier_fen_tian_ling_yu.name) as modifier_fen_tian_ling_yu
        if(!modifier) return;

        if(interrupted) {
            caster.RemoveModifierByName(modifier_fen_tian_ling_yu.name)
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

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target && !target.IsMagicImmune() && !target.IsInvulnerable() && (target.GetTeam() != this.GetCaster().GetTeam())) {
            const caster = this.GetCaster();
            const basicDamage = this.GetLevelSpecialValueFor('basic_damage', this.GetLevel() - 1)
            let primaryStateDamage = getForceOfRuleLevel('fire', this.GetCaster()) * this.GetSpecialValueFor('primary_state_factor')   
                       
            ApplyDamage({
                victim: target,
                attacker: caster,
                damage: primaryStateDamage + basicDamage,
                damage_type: DamageTypes.MAGICAL,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            return true;
        }
    }
}
