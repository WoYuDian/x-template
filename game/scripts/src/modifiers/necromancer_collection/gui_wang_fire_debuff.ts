import { you_ming_ji_dian } from "../../abilities/necromancer_collection/you_ming_ji_dian";
import { getPlayerHeroById } from "../../game_logic/game_operation";
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_gui_wang_fire_debuff extends BaseModifier {
    fireDamageFactor: number
    forceOfRule: number
    sourceAbility: CDOTABaseAbility

    OnCreated(params: object): void {
        if(!IsServer()) return;
        
        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('burning_interval'))
        const hero = getPlayerHeroById(this.GetCaster().GetPlayerOwnerID())

        if(hero && hero.HasAbility(you_ming_ji_dian.name)) {
            this.sourceAbility = hero.FindAbilityByName(you_ming_ji_dian.name)
            this.forceOfRule = getForceOfRuleLevel('spirit', hero) + getForceOfRuleLevel('rock', hero)
            this.fireDamageFactor = this.sourceAbility.GetSpecialValueFor('fire_damage_factor')
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
            fireDamageFactor: this.fireDamageFactor,
        }
    }

    HandleCustomTransmitterData(data) {        
        this.forceOfRule = data.forceOfRule
        this.fireDamageFactor = data.fireDamageFactor
    } 

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const damage = this.fireDamageFactor * this.forceOfRule
        ApplyDamage({
            victim: this.GetParent(),
            attacker: this.GetCaster(),
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            ability: this.GetAbility()    
        })
    }

    GetEffectName(): string {
        return 'particles/you_ming_ji_dian/gui_wang_fire.vpcf'
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }    

    IsDebuff(): boolean {
        return true
    }

}