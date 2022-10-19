
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_fabao_common } from "../../../modifiers/fabao/modifier_fabao_common";
import { modifier_basic } from "../modifier_basic";
@registerModifier()
export class modifier_bow_attributes extends modifier_basic {
    damageFactor: number = 0
    attackSpeedReduction: number = 0
    bowCasted: boolean = false
    bowParam: object
    bowstringCasted: boolean = false
    bowstringParam: object

    OnCreated(params: object): void {

    }


    OnRefresh(params: object): void {
        if(!IsServer()) return;
        
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            damageFactor: this.damageFactor,
            attackSpeedReduction: this.attackSpeedReduction,
        }
    }

    HandleCustomTransmitterData(data) {       
        this.attackSpeedReduction = data.attackSpeedReduction
        this.damageFactor = data.damageFactor
    }  

    updateAttributes(params: {part: 'bow' | 'bowstring', item: any}) {
        if(!IsServer()) return;
        this.addAttributes(params.item)
        
        if(params.part == 'bow') {
            this.bowCasted = true
            this.damageFactor += (params.item.toughness * 50) / 100
            this.attackSpeedReduction += (params.item.weight * 5)
            this.bowParam = params
        } else {
            this.bowstringCasted = true
            this.damageFactor += (params.item.toughness * 50) / 100
            this.attackSpeedReduction += (params.item.weight * 5)
            this.bowstringParam = params
        }
        
        if(this.bowCasted && this.bowstringCasted) {
            this.finishCast()
        }

        this.OnRefresh({})
    }

    finishCast() {
        if(!IsServer()) return;
        // return;
        this.releaseInitialParticle()
        const parent = this.GetParent()
        parent.AddAbility('cast_bow_armed')
        // parent.AddAbility('cast_sword_fusion')
        const fabaoBuff = parent.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common

        if(fabaoBuff && fabaoBuff.owner) {
            for(let i = 0; i < 6; i++) {
                const item = fabaoBuff.owner.GetItemInSlot(i)

                //@ts-ignore
                if(item && item.unit && (item.GetName() == 'item_fabao_embryo') && (item.unit == parent)) {
                    fabaoBuff.owner.RemoveItem(item)
                    const fabao = fabaoBuff.owner.AddItemByName('item_bow')
                    //@ts-ignore
                    fabao.linkedFabao = parent
                    break;
                }
            }

        }

        const particleId = ParticleManager.CreateParticle( "particles/cast_bow/cast_bow.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particleId, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particleId, false, false, -1, false, false)     
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP, ModifierFunction.TOOLTIP2]
    }

    OnTooltip(): number {
        return this.damageFactor
    }

    OnTooltip2(): number {
        return this.attackSpeedReduction
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