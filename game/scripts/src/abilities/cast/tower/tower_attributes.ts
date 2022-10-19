
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_fabao_common } from "../../../modifiers/fabao/modifier_fabao_common";
import { modifier_basic } from "../modifier_basic";
@registerModifier()
export class modifier_tower_attributes extends modifier_basic {
    damageFactor: number = 0
    duration: number = 0
    moveSpeed: number = 200
    auraRadius: number = 0
    rootCasted: boolean = false
    rootParam: object
    shellCasted: boolean = false
    shellParam: object

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
            damageFactor: this.damageFactor,
            duration: this.duration
        }
    }

    HandleCustomTransmitterData(data) {       
        this.moveSpeed = data.moveSpeed
        this.damageFactor = data.damageFactor
        this.duration = data.duration
    }  

    updateAttributes(params: {part: 'shell' | 'root', item: any}) {
        if(!IsServer()) return;
        this.addAttributes(params.item)
        
        if(params.part == 'shell') {
            this.rootCasted = true
            this.damageFactor += (params.item.hardness * 30) / 100
            this.duration += params.item.hardness * 0.5
            this.auraRadius += (80 + (params.item.toughness * 20))
            this.moveSpeed += (400 - (params.item.weight * 50))
            this.rootParam = params
        } else {
            this.shellCasted = true
            this.damageFactor += (params.item.weight * 50) / 100
            this.duration += (params.item.weight * 1)
            this.auraRadius += (80 + (params.item.toughness * 20))
            this.moveSpeed += (400 - (params.item.weight * 50))
            this.shellParam = params
        }

        if(this.rootCasted && this.shellCasted) {
            this.finishCast()
        }

        this.OnRefresh({})
    }

    finishCast() {
        if(!IsServer()) return;
        // return;
        this.releaseInitialParticle()
        const parent = this.GetParent()
        parent.AddAbility('cast_tower_suppress')
        const fabaoBuff = parent.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common

        if(fabaoBuff && fabaoBuff.owner) {
            for(let i = 0; i < 6; i++) {
                const item = fabaoBuff.owner.GetItemInSlot(i)

                //@ts-ignore
                if(item && item.unit && (item.GetName() == 'item_fabao_embryo') && (item.unit == parent)) {
                    fabaoBuff.owner.RemoveItem(item)
                    const fabao = fabaoBuff.owner.AddItemByName('item_tower')
                    //@ts-ignore
                    fabao.linkedFabao = parent
                    break;
                }
            }
        }

        const particleId = ParticleManager.CreateParticle( "particles/cast_tower/cast_tower.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particleId, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particleId, false, false, -1, false, false)     
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_ABSOLUTE, ModifierFunction.TOOLTIP, ModifierFunction.TOOLTIP2]
    }

    GetModifierMoveSpeed_Absolute(): number {
        return this.moveSpeed
    }

    OnTooltip(): number {
        return this.damageFactor
    }

    OnTooltip2(): number {
        return this.duration
    }

    GetTexture(): string {
        return 'puck_illusory_orb'
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }
}