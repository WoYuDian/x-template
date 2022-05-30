import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class resentment_stacking_owner_buff extends BaseModifier {
    damageBonusPerStack: number
    attackSpeedBonusPerStack: number
    particleId: ParticleID
    OnCreated(params: object): void {
        this.damageBonusPerStack = this.GetAbility().GetSpecialValueFor('damage_bonus_per_stack')
        this.attackSpeedBonusPerStack = this.GetAbility().GetSpecialValueFor('attack_speed_bonus_per_stack')

        if(IsServer()) {
            this.particleId = ParticleManager.CreateParticle( "particles/items2_fx/mask_of_madness.vpcf", ParticleAttachment.ABSORIGIN_FOLLOW, this.GetParent() )
            ParticleManager.SetParticleControlEnt( this.particleId, 1, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
            ParticleManager.SetParticleControlEnt( this.particleId, 3, this.GetParent(), ParticleAttachment.ABSORIGIN_FOLLOW, null, this.GetParent().GetOrigin(), true )
        }        
    }

    OnDestroy(): void {
        if(!IsServer()) return;
        ParticleManager.DestroyParticle(this.particleId, false)
    }

    OnRefresh(params: object): void {      
        this.damageBonusPerStack = this.GetAbility().GetSpecialValueFor('damage_bonus_per_stack')
        this.attackSpeedBonusPerStack = this.GetAbility().GetSpecialValueFor('attack_speed_bonus_per_stack')       
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.PREATTACK_BONUS_DAMAGE, ModifierFunction.MODEL_SCALE, ModifierFunction.ATTACKSPEED_BONUS_CONSTANT]
    }

    GetModifierPreAttack_BonusDamage(): number {
        return this.damageBonusPerStack * (this.GetStackCount() + 1)
    }

    GetModifierModelScale(): number {
        return (this.GetStackCount() + 1) * 5 
    }

    GetModifierAttackSpeedBonus_Constant(): number {
        return (this.GetStackCount() + 1) * this.attackSpeedBonusPerStack;
    }
    IsHidden(): boolean {
        return false
    }

}