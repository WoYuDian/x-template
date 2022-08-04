import { you_ming_ji_dian } from "../../abilities/necromancer_collection/you_ming_ji_dian";
import { getPlayerHeroById } from "../../game_logic/game_operation";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { modifier_gui_wang_fire } from "./gui_wang_fire";

@registerModifier()
export class resentment_stacking_owner_buff extends BaseModifier {

    attackStackFactor: number
    attackSpeedStackFactor: number
    forceOfRule: number
    sourceAbility: CDOTABaseAbility
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const hero = getPlayerHeroById(this.GetParent().GetPlayerOwnerID())

        if(hero && hero.HasAbility(you_ming_ji_dian.name)) {
            this.sourceAbility = hero.FindAbilityByName(you_ming_ji_dian.name)
            this.forceOfRule = getForceOfRuleLevel('spirit', hero) + getForceOfRuleLevel('rock', hero)
            this.attackStackFactor = this.sourceAbility.GetSpecialValueFor('attack_stack_factor')
            this.attackSpeedStackFactor = this.sourceAbility.GetSpecialValueFor('attack_speed_stack_factor')
        }
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        this.OnCreated({})
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            forceOfRule: this.forceOfRule,
            attackStackFactor: this.attackStackFactor,
            attackSpeedStackFactor: this.attackSpeedStackFactor,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.forceOfRule = data.forceOfRule
        this.attackStackFactor = data.attackStackFactor
        this.attackSpeedStackFactor = data.attackSpeedStackFactor
    } 

    GetEffectName(): string {
        return 'particles/items2_fx/mask_of_madness.vpcf'
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PREATTACK_BONUS_DAMAGE, ModifierFunction.MODEL_SCALE, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierPreAttack_BonusDamage(): number {
        return this.attackStackFactor * this.forceOfRule * this.GetStackCount()
    }

    GetModifierModelScale(): number {
        return (this.GetStackCount() + 1) * 5 
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return this.attackSpeedStackFactor * this.forceOfRule * this.GetStackCount()
    }

    IsHidden(): boolean {
        return false
    }
}