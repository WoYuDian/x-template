
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_shi_jian_ling_yu_debuff extends BaseModifier {    
    abilities: CDOTABaseAbility[] = []
    cooldownCheckInterval: number = 0.5
    OnCreated(params: object): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        for(let i = 0; i < 32; i++) {
            const ability = parent.GetAbilityByIndex(i)
            if(ability) {
                this.abilities.push(ability)
            }
            
        }

        this.StartIntervalThink(this.cooldownCheckInterval)
    }
    
    OnIntervalThink(): void {
        if(!IsServer()) return;

        for(const ability of this.abilities) {
            if(!ability.IsCooldownReady() && !ability.IsPassive()) {
                ability.StartCooldown(ability.GetCooldownTimeRemaining() + this.cooldownCheckInterval)
            }
        }
    }

    OnDestroy(): void {
        if(!IsServer()) return;

        for(const ability of this.abilities) {
            ability.SetFrozenCooldown(true)
        }
    }
    
    CheckState(): Partial<Record<ModifierState, boolean>> {
        return {
            [ModifierState.STUNNED]: true,
            [ModifierState.FROZEN]: true
        }
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.PROJECTILE_SPEED_BONUS
        ]
    }
    
    GetModifierProjectileSpeedBonus(): number {
        return -10000
    }
}