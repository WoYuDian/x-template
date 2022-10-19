import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

const abilities = ['da_shou_yin', 'jin_gang_hou', 'jin_gang_zhao', 'xu_mi_zhi', 'shan_shen_ji']
@registerModifier()
export class modifier_luo_han_quan extends BaseModifier {
    OnCreated(params: any): void {
        this.SetStackCount(0)
    }

    OnRefresh(params: object): void {
    }

    OnStackCountChanged(stackCount: number): void {
        if(!IsServer()) return
        const curStack = this.GetStackCount()
        const parent = this.GetParent()

        for(const abilityName of abilities) {
            const ability = parent.FindAbilityByName(abilityName) 

            if(!ability) continue;

            const abilitBuffCost = ability.GetSpecialValueFor('buff_cost') || 100

            if(curStack >= abilitBuffCost) {
                ability.SetActivated(true)
            } else {
                ability.SetActivated(false)
            }
        }

    }

    IsPurgable(): boolean {
        return false
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.TOOLTIP]
    }

    OnTooltip(): number {
        return this.GetStackCount()           
    }
}