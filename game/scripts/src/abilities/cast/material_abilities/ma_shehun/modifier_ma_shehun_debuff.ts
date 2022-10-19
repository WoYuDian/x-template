
import { getFabaoSumOfForceOfRuleLevels } from "../../../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../../../lib/dota_ts_adapter";
@registerModifier()
export class modifier_ma_shehun_debuff extends BaseModifier {
    OnCreated(params: object): void {
        if(!IsServer()) return;

        this.StartIntervalThink(this.GetAbility().GetSpecialValueFor('damage_interval'))
    }   

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;

        const parent = this.GetParent()
        if(event.unit != parent) return;

        const buff = this.GetCaster().FindModifierByName('modifier_ma_shehun')

        if(buff) {
            ProjectileManager.CreateTrackingProjectile({
                //@ts-ignore
                vSourceLoc: parent.GetAbsOrigin() + Vector(0, 0, 200),
                Target: this.GetCaster(),
                Ability: this.GetAbility(),
                EffectName: 'particles/units/heroes/hero_necrolyte/necrolyte_base_attack.vpcf',
                bDodgeable: false,
                iMoveSpeed: 1000
            })
        }
    }
}
