
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
import { addForceOfRule } from "../../game_logic/realm_manager";
import { materialAbilityMap } from "./material_ability_map";
@registerModifier()
export class modifier_basic extends BaseModifier {
    OnCreated(params: object): void {
    }

    OnRefresh(params: object): void {        
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