
import { BaseModifier, registerModifier } from "../../../lib/dota_ts_adapter";
import { modifier_fabao_common } from "../../../modifiers/fabao/modifier_fabao_common";
import { modifier_basic } from "../modifier_basic";
@registerModifier()
export class modifier_shield_attributes extends modifier_basic {
    curShield: number = 0
    maxShield: number = 0
    shieldRegen: number = 30
    armorBonus: number = 0
    magicResistance: number = 0
    moveSpeed: number = 200
    bodyCasted: boolean = false
    bodyParam: object
    surfaceCasted: boolean = false
    surfaceParam: object

    OnCreated(params: object): void {
        if(!IsServer()) return;
        this.StartIntervalThink(1)
    }

    OnIntervalThink(): void {
        this.curShield += this.shieldRegen;
        if(this.curShield > this.maxShield) {
            this.curShield = this.maxShield
        }
    }

    OnRefresh(params: object): void {
        if(!IsServer()) return;
        
        this.SetHasCustomTransmitterData(true)
        this.SendBuffRefreshToClients()
    }

    AddCustomTransmitterData() {
        return {
            moveSpeed: this.moveSpeed,
            maxShield: this.maxShield,
            shieldRegen: this.shieldRegen
        }
    }

    HandleCustomTransmitterData(data) {       
        this.moveSpeed = data.moveSpeed
        this.maxShield = data.maxShield
        this.shieldRegen = data.shieldRegen
    }  

    updateAttributes(params: {part: 'body' | 'surface', item: any}) {
        if(!IsServer()) return;
        this.addAttributes(params.item)
        
        if(params.part == 'body') {
            this.bodyCasted = true
            this.maxShield += (500 + (params.item.hardness * 500))
            this.armorBonus += params.item.hardness * 5
            this.moveSpeed += (400 - (params.item.weight * 50))
            this.bodyParam = params
        } else {
            this.surfaceCasted = true
            this.shieldRegen += (params.item.toughness * 50)
            this.magicResistance += (30 + (params.item.toughness * 5))
            this.moveSpeed += (400 - (params.item.weight * 50))
            this.surfaceParam = params
        }

        if(this.bodyCasted && this.surfaceCasted) {
            this.finishCast()
        }

        this.OnRefresh({})
    }

    finishCast() {
        if(!IsServer()) return;
        // return;
        this.releaseInitialParticle()
        const parent = this.GetParent()
        parent.AddAbility('cast_shield_armed')
        const fabaoBuff = parent.FindModifierByName(modifier_fabao_common.name) as modifier_fabao_common

        if(fabaoBuff && fabaoBuff.owner) {
            for(let i = 0; i < 6; i++) {
                const item = fabaoBuff.owner.GetItemInSlot(i)

                //@ts-ignore
                if(item && item.unit && (item.GetName() == 'item_fabao_embryo') && (item.unit == parent)) {
                    fabaoBuff.owner.RemoveItem(item)
                    const fabao = fabaoBuff.owner.AddItemByName('item_shield')
                    //@ts-ignore
                    fabao.linkedFabao = parent
                    break;
                }
            }
        }

        const particleId = ParticleManager.CreateParticle( "particles/cast_shield/cast_shield.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
        ParticleManager.SetParticleControlEnt( particleId, 0, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        this.AddParticle(particleId, false, false, -1, false, false)     
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.MOVESPEED_ABSOLUTE, ModifierFunction.TOOLTIP, ModifierFunction.TOOLTIP2]
    }

    GetModifierMoveSpeed_Absolute(): number {
        return this.moveSpeed
    }

    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.NO_UNIT_COLLISION]: true
        }
    }

    OnTooltip(): number {
        return this.maxShield
    }

    OnTooltip2(): number {
        return this.shieldRegen
    }

    GetTexture(): string {
        return 'puck_illusory_orb'
    }
}