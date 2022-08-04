
import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_shi_du_debuff extends BaseModifier {
    damageFactor: number
    OnCreated(params: object): void { 
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')

        if(!IsServer) return;        
        this.StartIntervalThink(1)
    }

    OnRefresh(params: object): void {        
        this.damageFactor = this.GetAbility().GetSpecialValueFor('damage_factor')
    }

    GetEffectName(): string {
        return 'particles/econ/items/venomancer/poison_touch_shoulder/poison_touch_shoulder_sparks.vpcf'
    }

    OnIntervalThink(): void {
        if(!IsServer()) return;

        const caster = this.GetCaster()
        const damage = (getForceOfRuleLevel('rock', caster) + getForceOfRuleLevel('spirit', caster)) * this.damageFactor

        ApplyDamage({
            victim: this.GetParent(),
            attacker: caster,
            damage: damage,
            damage_type: DamageTypes.MAGICAL,
            ability: this.GetAbility()    
        })
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_DEATH]
    }

    OnDeath(event: ModifierInstanceEvent): void {
        if(!IsServer()) return;
        if(event.unit != this.GetParent()) return;

        const caster = this.GetCaster()
        const unit = CreateUnitByName('npc_necromance_zombie', 
        //@ts-ignore
        event.unit.GetAbsOrigin(), 
        true, 
        null, 
        caster, 
        caster.GetTeam())

        unit.SetControllableByPlayer(this.GetCaster().GetPlayerOwnerID(), true)

    }
}