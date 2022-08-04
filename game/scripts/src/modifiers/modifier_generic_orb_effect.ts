//@ts-nocheck
import { BaseModifier, registerModifier } from "../lib/dota_ts_adapter";
import { printObject } from "../util";

@registerModifier()
export class modifier_generic_orb_effect extends BaseModifier {
    ability: CDOTABaseAbility;
    cast: boolean;
    records: {};
    IsHidden(): boolean {
        return true;
    }

    IsDebuff(): boolean {
        return false
    }

    IsPurgable(): boolean {
        return false
    }

    GetAttributes(): ModifierAttribute {
        return ModifierAttribute.PERMANENT
    }

    OnCreated(params: object): void {
        this.ability = this.GetAbility()
        this.cast = false
        this.records = {}
    }

    OnRefresh(params: object): void {
        
    }

    OnDestroy(): void {
        
    }

    DeclareFunctions(): ModifierFunction[] {
        return [
            ModifierFunction.ON_ATTACK,
            ModifierFunction.ON_ATTACK_FAIL,
            ModifierFunction.PROCATTACK_FEEDBACK,
            ModifierFunction.ON_ATTACK_RECORD_DESTROY,
            ModifierFunction.ON_ORDER,
            ModifierFunction.PROJECTILE_NAME
        ]
    }

    OnAttack(event: ModifierAttackEvent): void {
        if(event.attacker != this.GetParent()) return;

        if(this.shouldLaunch(event.target)) {
            this.ability.UseResources(true, false, true)

            this.records[event.record] = true
            if(this.ability.OnOrbFire) {
                this.ability.OnOrbFire(event)
            }
        }

        this.cast = false;
    }

    GetModifierProcAttack_Feedback(event: ModifierAttackEvent): number {
        if(this.records[event.record]) {
            if(this.ability.OnOrbImpact) {
                this.ability.OnOrbImpact(event)
            }
        }
    }

    OnAttackFail(event: ModifierAttackEvent): void {
        if(this.records[event.record]) {
            if(this.ability.OnOrbFail) {
                this.ability.OnOrbFail(event)
            }
        }
    }

    OnAttackRecordDestroy(event: ModifierAttackEvent): void {
        this.records[event.record] = null;
    }

    OnOrder(event: ModifierUnitEvent): void {
        if(event.unit != this.GetParent()) return;

        if(event.ability) {
            if(event.ability == this.GetAbility()) {
                this.cast = true;
                return
            }

            let pass = false;
            const behavior = event.ability.GetBehaviorInt() as AbilityBehavior
            if(this.FlagExist(behavior, AbilityBehavior.DONT_CANCEL_CHANNEL) ||
                this.FlagExist(behavior, AbilityBehavior.DONT_CANCEL_MOVEMENT) ||
                this.FlagExist(behavior, AbilityBehavior.IGNORE_CHANNEL)) {
                    pass = true
            }

            if(this.cast && !pass) {
                this.cast = false
            }
        } else {
            if(this.cast) {
                if(this.FlagExist(event.order_type, UnitOrder.MOVE_TO_POSITION) ||
                this.FlagExist(event.order_type, UnitOrder.MOVE_TO_TARGET) ||
                this.FlagExist(event.order_type, UnitOrder.ATTACK_MOVE) ||
                this.FlagExist(event.order_type, UnitOrder.ATTACK_TARGET) ||
                this.FlagExist(event.order_type, UnitOrder.STOP) ||
                this.FlagExist(event.order_type, UnitOrder.HOLD_POSITION)) {
                    this.cast = false
                }
            }
        }
    }

    GetModifierProjectileName(): string {
        if(!this.ability.GetProjectileName) return;

        if(this.shouldLaunch(this.GetCaster().GetAggroTarget())) {
            return this.ability.GetProjectileName()
        }
    }

    FlagExist(a, b) {
        let p = 1, c = 0, d = b;
        b = parseInt(b)
        while((a > 0) && (b > 0)) {
            const ra = a % 2, rb = b % 2
            if((ra + rb) > 1) {
                c = c + p
            }

            a = (a - ra) / 2;
            b = (b - rb) / 2;
            p = p * 2;
        }

        return c==d
    }

    shouldLaunch(target) {
        if(this.ability.GetAutoCastState()) {
            //@ts-ignore
            if(this.ability.CastFilterResultTarge && (this.ability.CastFilterResultTarge != CDOTA_Ability_Lua.CastFilterResultTarget)) {
                //@ts-ignore
                if(this.ability.CastFilterResultTarge(target) != UnitFilterResult.SUCCESS) {
                    this.cast = true;
                }
            } else {
                const nResult = UnitFilter(
                    target,
                    this.ability.GetAbilityTargetTeam(),
                    this.ability.GetAbilityTargetType(),
                    this.ability.GetAbilityTargetFlags(),
                    this.GetCaster().GetTeamNumber()
                )
    
                if(nResult == UnitFilterResult.SUCCESS) {
                    this.cast = true
                }
            }
        }

        if(this.cast && this.ability.IsFullyCastable() && (!this.GetParent().IsSilenced())) {
            return true
        }

        return false
    }
}