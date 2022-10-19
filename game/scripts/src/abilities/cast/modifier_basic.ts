
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { addForceOfRule } from "../../game_logic/realm_manager";
import { materialAbilityMap } from "./material_ability_map";
import { modifier_fabao_common } from "../../modifiers/fabao/modifier_fabao_common";
@registerModifier()
export class modifier_basic extends BaseModifier {
    OnCreated(params: object): void {
    }

    OnRefresh(params: object): void {        
    }

    releaseInitialParticle() {
        const parent = this.GetParent()
        const fabaoBuff = parent.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common

        if(fabaoBuff) {
            ParticleManager.DestroyParticle(fabaoBuff.particleId, false)
            ParticleManager.ReleaseParticleIndex(fabaoBuff.particleId)
        }
    }

    addAttributes(item: {
        item: CDOTA_Item;
        toughness: number;
        hardness: number;
        weight: number;
        forceOfFire: number;
        forceOfWater: number;
        forceOfRock: number;
        forceOfWood: number;
        forceOfMetal: number;
        forceOfBody: number;
        forceOfSpirit: number;
        materialAbility1: string;
        materialAbility2: string;
    }) {
        if(!IsServer()) return

        const parent = this.GetParent()
        if(item.forceOfFire > 0) {
            addForceOfRule({rule_name: 'fire',bonus: item.forceOfFire}, parent)
        }

        if(item.forceOfWater > 0) {
            addForceOfRule({rule_name: 'water',bonus: item.forceOfWater}, parent)
        }

        if(item.forceOfRock > 0) {
            addForceOfRule({rule_name: 'rock',bonus: item.forceOfRock}, parent)
        }
        
        if(item.forceOfWood > 0) {
            addForceOfRule({rule_name: 'wood',bonus: item.forceOfWood}, parent)
        }

        if(item.forceOfMetal > 0) {
            addForceOfRule({rule_name: 'metal',bonus: item.forceOfMetal}, parent)
        }

        if(item.forceOfBody > 0) {
            addForceOfRule({rule_name: 'body',bonus: item.forceOfBody}, parent)
        }

        if(item.forceOfSpirit > 0) {
            addForceOfRule({rule_name: 'spirit',bonus: item.forceOfSpirit}, parent)
        }

        const ability1 = materialAbilityMap[item.materialAbility1]
        if(ability1 && !parent.HasAbility(ability1)) {
            parent.AddAbility(ability1)
        }

        const ability2 = materialAbilityMap[item.materialAbility2]
        if(ability2 && !parent.HasAbility(ability2)) {
            parent.AddAbility(ability2)
        }
    }
}

//models
//  几何方块 印
//maps/cavern_assets/models/crystals/crystal05.vmdl
//models/heroes/death_prophet/rubick_arcana_death_prophet_ghost.vmdl
//maps/cavern_assets/models/driller/driller_tip_01.vmdl 塔

//幡旗
//maps/journey_assets/props/teams/banner_journey_radiant.vmdl
//maps/cavern_assets/models/teams/banner_dire_cavern_small.vmdl 

//models/heroes/alchemist/alchemist_leftbottle.vmdl 瓶子
//models/heroes/antimage_female/debut/models/am_debut_pot.vmdl 钵
//models/props_debris/clay_pots_broken001a.vmdl 罐子
//书
//models/heroes/invoker_kid/debut/invoker_kid_debut_tome_a.vmdl
//models/heroes/invoker_kid/debut/invoker_kid_debut_tome_c.vmdl

//翅膀
//models/heroes/nightstalker/nightstalker_wings_night.vmdl 
//models/heroes/omniknight/omniknightwings.vmdl
//models/heroes/skywrath_mage/skywrath_mage_wings.vmdl

//models/heroes/oracle/back_item.vmdl 圆盘

//models/heroes/pangolier/pangolier_gyroshell2.vmdl 滚滚圆球

//models/heroes/phantom_lancer/phantom_lancer_weapon.vmdl长矛
//models/heroes/phoenix/phoenix_egg.vmdl凤凰蛋

//剑关键词 abaddon

//葫芦
//models/items/brewmaster/offhand_jug/offhand_jug.vmdl 
//models/items/brewmaster/treasures_of_the_east_off_hand/treasures_of_the_east_off_hand.vmdl

//models/items/brewmaster/treasures_of_the_east_weapon/treasures_of_the_east_weapon.vmdl拂尘

//models/items/chaos_knight/chaos_knight_ti7_shield/chaos_knight_ti7_shield.vmdl 混沌圆盾
//models/items/chaos_knight/ck_ti9_immortal_weapon/ck_ti9_immortal_weapon.vmdl残剑
//models/items/chaos_knight/wrath_of_the_illustrious_sage_off_hand/wrath_of_the_illustrious_sage_off_hand.vmdl 八卦盾
//models/items/chaos_knight/wrath_of_the_illustrious_sage_shoulder/wrath_of_the_illustrious_sage_shoulder.vmdl战甲
//models/items/chaos_knight/wrath_of_the_illustrious_sage_weapon/wrath_of_the_illustrious_sage_weapon.vmdl长戟
//models/items/dark_seer/ds_manipulator_of_warsituation_back/ds_manipulator_of_warsituation_back.vmdl沙漏
//models/items/earth_spirit/ti9_cache_earthspirit_turquoise_giant_ability_4/ti9_cache_earthspirit_turquoise_giant_ability_4.vmdl 土猫圆球

//models/items/grimstroke/gs_fall20_immortal_head/gs_fall20_immortal_dragon.vmdl 龙

//models/items/oracle/ti9_cache_oracle_augury_prophet_weapon/ti9_cache_oracle_augury_prophet_weapon.vmdl金字塔
//models/items/phoenix/ultimate/blazing_wing_blazing_egg/blazing_wing_blazing_egg.vmdl 凤凰蛋
//models/items/phoenix/ultimate/eye_of_the_sun_sun_pyramid/eye_of_the_sun_sun_pyramid.vmdl 金字塔
//models/items/phoenix/ultimate/golden_nirvana_golden_nirvana_nova/golden_nirvana_golden_nirvana_nova.vmdl凤凰蛋
//models/items/warlock/warlock_ti9_immortal_lantern/warlock_ti9_immortal_lantern.vmdl 术士球
//models/particle/legion_duel_banner.vmdl 幡旗
//models/props_gameplay/dust.vmdl 显隐之尘
//models/props_gameplay/temple_portal001.vmdl 时钟
//models/props_items/monkey_king_bar01.vmdl金箍棒