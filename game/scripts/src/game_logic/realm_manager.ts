import { getPlayerHeroById } from "./game_operation"
import { modifier_elixir_zhuji } from "../modifiers/break_buff/modifier_elixir_zhuji";
import { modifier_realm_zhuji } from "../modifiers/realm/modifier_realm_zhuji";

export function breakRealm(playerId: PlayerID) {    
    const hero = getPlayerHeroById(playerId)

    if(!hero) return;

    const level = hero.GetLevel();

    if(level == 4) {
        zhujiBreak(hero)
    }

}

export function heroLevelUp(playerId: PlayerID) {
    const hero = getPlayerHeroById(playerId);

    if(hero) {
        if((hero.GetLevel() + 1) == 5) {
            hero.AddNewModifier(hero, null, modifier_elixir_zhuji.name, {percentage: 50})
        }
        if(hero.HasModifier(modifier_realm_zhuji.name)) {
            hero.FindModifierByName(modifier_realm_zhuji.name).IncrementStackCount()
            const realmAbility = hero.FindAbilityByName('medusa_mana_shield')
            if(realmAbility) {
                if(realmAbility.GetLevel() < realmAbility.GetMaxLevel()) {
                    realmAbility.UpgradeAbility(true)
                }                
            }
        }        
    }
}


function zhujiBreak(hero: CDOTA_BaseNPC_Hero) {
    let buffZhuji = hero.FindModifierByName(modifier_elixir_zhuji.name)
    if(!buffZhuji) {
        buffZhuji = hero.AddNewModifier(hero, null, modifier_elixir_zhuji.name, {percentage: 50})
    }

    const percentage = buffZhuji.GetStackCount();

    if(RollPercentage(percentage)) {
        hero.HeroLevelUp(true);
        if(!hero.HasModifier(modifier_realm_zhuji.name)) {
            hero.AddNewModifier(hero, null, modifier_realm_zhuji.name, {})
            hero.RemoveModifierByName(modifier_elixir_zhuji.name)
            hero.AddAbility('medusa_mana_shield')
        }
    } else {
        buffZhuji.SetStackCount(percentage - 20)
    }
}