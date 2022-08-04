import { getPlayerHeroById } from "./game_operation"
import { modifier_elixir_zhuji } from "../modifiers/break_buff/modifier_elixir_zhuji";
import { modifier_realm_zhuji } from "../modifiers/realm/modifier_realm_zhuji";
import { modifier_elixir_jindan } from "../modifiers/break_buff/modifier_elixir_jindan";
import { modifier_realm_jindan } from "../modifiers/realm/modifier_realm_jindan";
import { modifier_elixir_yuanying } from "../modifiers/break_buff/modifier_elixir_yuanying";
import { modifier_realm_yuanying } from "../modifiers/realm/modifier_realm_yuanying";

import { modifier_force_of_water } from "../modifiers/realm/modifier_force_of_water";
import { modifier_force_of_fire } from "../modifiers/realm/modifier_force_of_fire";
import { modifier_force_of_wood } from "../modifiers/realm/modifier_force_of_wood";
import { modifier_force_of_rock } from "../modifiers/realm/modifier_force_of_rock";
import { modifier_force_of_metal } from "../modifiers/realm/modifier_force_of_metal";
import { modifier_force_of_body } from "../modifiers/realm/modifier_force_of_body";
import { modifier_force_of_spirit } from "../modifiers/realm/modifier_force_of_spirit";
import { Timers } from "../lib/timers";
import { modifier_fabao_common } from "../modifiers/fabao/modifier_fabao_common";
export const forceOfRuleMap = {
    water: modifier_force_of_water,
    fire: modifier_force_of_fire,
    wood: modifier_force_of_wood,
    rock: modifier_force_of_rock,
    metal: modifier_force_of_metal,
    body: modifier_force_of_body,
    spirit: modifier_force_of_spirit
}
export function breakRealm(playerId: PlayerID) {
    const hero = getPlayerHeroById(playerId)

    if(!hero) return;

    const level = hero.GetLevel();

    if(level == 4) {
        zhujiBreak(hero)
    } else if (level == 9) {
        jindanBreak(hero)
    } else if (level == 14) {
        yuanyingBreak(hero)
    }

}

export function heroLevelUp(playerId: PlayerID) {
    const hero = getPlayerHeroById(playerId);

    if(hero) {
        if((hero.GetLevel() + 1) == 5) {
            hero.AddNewModifier(hero, null, modifier_elixir_zhuji.name, {percentage: 50})
        }
        if((hero.GetLevel() + 1) == 10) {
            hero.AddNewModifier(hero, null, modifier_elixir_jindan.name, {percentage: 30})
        }
        if((hero.GetLevel() + 1) == 15) {
            hero.AddNewModifier(hero, null, modifier_elixir_yuanying.name, {percentage: 20})
        }

        if(hero.HasModifier(modifier_realm_yuanying.name)) {
            if(hero.FindModifierByName(modifier_realm_yuanying.name).GetStackCount() < 5) {
                hero.FindModifierByName(modifier_realm_yuanying.name).IncrementStackCount()
            }
            
            // const realmAbility = hero.FindAbilityByName('medusa_mana_shield')
            // if(realmAbility) {
            //     if(realmAbility.GetLevel() < realmAbility.GetMaxLevel()) {
            //         realmAbility.UpgradeAbility(true)
            //     }                
            // }
        } else if(hero.HasModifier(modifier_realm_jindan.name)) {
            hero.FindModifierByName(modifier_realm_jindan.name).IncrementStackCount()
            const realmAbility = hero.FindAbilityByName('mana_recovery')
            if(realmAbility) {
                if(realmAbility.GetLevel() < realmAbility.GetMaxLevel()) {
                    realmAbility.UpgradeAbility(true)
                }                
            }
        } else if(hero.HasModifier(modifier_realm_zhuji.name)) {
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

function yuanyingBreak(hero: CDOTA_BaseNPC_Hero) {
    let buffZhuji = hero.FindModifierByName(modifier_elixir_yuanying.name)
    if(!buffZhuji) {
        buffZhuji = hero.AddNewModifier(hero, null, modifier_elixir_yuanying.name, {percentage: 20})
    }
    buffZhuji = hero.FindModifierByName(modifier_elixir_yuanying.name)

    const percentage = buffZhuji.GetStackCount();

    if(RollPercentage(percentage)) {
        hero.HeroLevelUp(true);
        if(!hero.HasModifier(modifier_realm_yuanying.name)) {
            hero.AddNewModifier(hero, null, modifier_realm_yuanying.name, {})
            hero.RemoveModifierByName(modifier_elixir_yuanying.name)
            // hero.AddAbility('mana_recovery')

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/events/fall_2021/hero_levelup_fall_2021.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, hero )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
        }
    } else {
        buffZhuji.SetStackCount(percentage - 50)
    }
}

function jindanBreak(hero: CDOTA_BaseNPC_Hero) {
    let buffZhuji = hero.FindModifierByName(modifier_elixir_jindan.name)
    if(!buffZhuji) {
        buffZhuji = hero.AddNewModifier(hero, null, modifier_elixir_jindan.name, {percentage: 30})
    }
    buffZhuji = hero.FindModifierByName(modifier_elixir_jindan.name)

    const percentage = buffZhuji.GetStackCount();

    if(RollPercentage(percentage)) {
        hero.HeroLevelUp(true);
        if(!hero.HasModifier(modifier_realm_jindan.name)) {
            hero.AddNewModifier(hero, null, modifier_realm_jindan.name, {})
            hero.RemoveModifierByName(modifier_elixir_jindan.name)
            hero.AddAbility('mana_recovery')

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/events/fall_2021/hero_levelup_fall_2021.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, hero )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
        }
    } else {
        buffZhuji.SetStackCount(percentage - 30)
    }
}

function zhujiBreak(hero: CDOTA_BaseNPC_Hero) {
    let buffZhuji = hero.FindModifierByName(modifier_elixir_zhuji.name)
    if(!buffZhuji) {
        buffZhuji = hero.AddNewModifier(hero, null, modifier_elixir_zhuji.name, {percentage: 50})
    }
    buffZhuji = hero.FindModifierByName(modifier_elixir_zhuji.name)

    const percentage = buffZhuji.GetStackCount();

    if(RollPercentage(percentage)) {
        hero.HeroLevelUp(true);
        if(!hero.HasModifier(modifier_realm_zhuji.name)) {
            hero.AddNewModifier(hero, null, modifier_realm_zhuji.name, {})
            hero.RemoveModifierByName(modifier_elixir_zhuji.name)
            hero.AddAbility('medusa_mana_shield')

            const nFXIndex = ParticleManager.CreateParticle( "particles/econ/events/fall_2021/hero_levelup_fall_2021.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, hero )
            ParticleManager.SetParticleControlEnt( nFXIndex, 1, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.SetParticleControlEnt( nFXIndex, 3, hero, ParticleAttachment.ABSORIGIN_FOLLOW, null, hero.GetAbsOrigin(), true )
            ParticleManager.ReleaseParticleIndex( nFXIndex )
        }
    } else {
        buffZhuji.SetStackCount(percentage - 20)
    }
}

export function addForceOfRule(bonusInfo: {rule_name: string, bonus: number}, hero: CDOTA_BaseNPC_Hero | CDOTA_BaseNPC) {
    const modifier = forceOfRuleMap[bonusInfo.rule_name];
    if(!hero.FindModifierByName(modifier.name)) {
        hero.AddNewModifier(hero, null, modifier.name, {})        
    }

    Timers.CreateTimer(0.5, function() {
        const heroModifier = hero.FindModifierByName(modifier.name)
        heroModifier.SetStackCount(heroModifier.GetStackCount() + bonusInfo.bonus)
    })        
}

export function getForceOfRuleLevel(ruleName: string, unit: CDOTA_BaseNPC) {
    if(!unit || !unit.FindAbilityByName) return;
    const buff = unit.FindModifierByName(forceOfRuleMap[ruleName]?.name || '')

    if(buff) {
        return buff.GetStackCount();
    } else { 
        return 0
    }
}

export function getSumOfForceOfRuleLevels(ruleNames: string[], unit: CDOTA_BaseNPC) {    
    if(!unit || !unit.FindAbilityByName) return;

    let totalLevel = 0

    for(const ruleName of ruleNames) {
        const buff = unit.FindModifierByName(forceOfRuleMap[ruleName]?.name || '')

        if(buff) {
            totalLevel += buff.GetStackCount();
        }
    }

    return totalLevel
}

export function getFabaoSumOfForceOfRuleLevels(ruleNames: string[], unit: CDOTA_BaseNPC) {    
    if(!unit || !unit.FindAbilityByName) return;

    let totalLevel = 0
    const fabaoBuff = unit.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common;

    if(fabaoBuff) {
        totalLevel += getSumOfForceOfRuleLevels(ruleNames, fabaoBuff.owner) 
    }

    for(const ruleName of ruleNames) {
        const buff = unit.FindModifierByName(forceOfRuleMap[ruleName]?.name || '')

        if(buff) {
            totalLevel += buff.GetStackCount();
        }
    }

    return totalLevel
}

export function getRuleNamesOfUnit(unit: CDOTA_BaseNPC) {
    const ruleNames = []
    for(const key in forceOfRuleMap) {
        const buff = unit.FindModifierByName(forceOfRuleMap[key].name)
        if(buff) {
            ruleNames.push(key)
        }
    }

    return ruleNames
}