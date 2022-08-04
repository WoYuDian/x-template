
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_fabao_common } from "../../../modifiers/fabao/modifier_fabao_common";
import { modifier_basic } from "../modifier_basic";
@registerModifier()
export class modifier_sword_attributes extends modifier_basic {
    damageFactor: number = 0
    moveSpeed: number = 2000
    tiltCasted: boolean = false
    tiltParam: object
    bladeCasted: boolean = false
    bladeParam: object

    OnCreated(params: object): void {

    }


    OnRefresh(params: object): void {
        if(!IsServer()) return;
        
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            moveSpeed: this.moveSpeed,
        }
    }

    HandleCustomTransmitterData(data) {       
        this.moveSpeed = data.moveSpeed
    }  

    updateAttributes(params: {part: 'tilt' | 'blade', item: any}) {
        if(!IsServer()) return;
        this.addAttributes(params.item)
        
        if(params.part == 'tilt') {
            this.tiltCasted = true
            this.damageFactor += (params.item.hardness * 50 + params.item.weight * 30) / 100
            this.moveSpeed -= params.item.weight * 50
            this.tiltParam = params
        } else {
            this.bladeCasted = true
            this.damageFactor += (params.item.hardness * 100 + params.item.weight * 50) / 100
            this.moveSpeed -= params.item.weight * 80
            this.bladeParam = params
        }
        
        if(this.tiltCasted && this.bladeCasted) {
            this.finishCast()
        }

        this.OnRefresh({})
    }

    finishCast() {
        if(!IsServer()) return;

        const parent = this.GetParent()
        parent.AddAbility('cast_sword_shot')
        parent.AddAbility('cast_sword_fusion')
        const fabaoBuff = parent.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common

        if(fabaoBuff && fabaoBuff.owner) {
            const item = fabaoBuff.owner.FindItemInInventory('item_fabao_embryo')
            fabaoBuff.owner.RemoveItem(item)
            const fabao = fabaoBuff.owner.AddItemByName('item_sword')
            //@ts-ignore
            fabao.linkedFabao = parent
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_ABSOLUTE]
    }

    GetModifierMoveSpeed_Absolute(): number {
        return this.moveSpeed
    }
}