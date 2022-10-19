import { BaseAbility, registerAbility } from "../../../../lib/dota_ts_adapter"
import { modifier_ma_shehun } from "./modifier_ma_shehun";
@registerAbility()
export class ma_shehun extends BaseAbility
{    
    Spawn(): void {
        if(!IsServer()) return;

        this.SetLevel(1)
    }
    GetIntrinsicModifierName(): string {
        return modifier_ma_shehun.name
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(!IsServer()) return;
        const caster = this.GetCaster()
        if(target != caster) return;

        const buff = caster.FindModifierByName(modifier_ma_shehun.name)

        
        if(buff) {
            buff.IncrementStackCount()
            //@ts-ignore
            buff.OnRefresh({})
        }
    }
}

