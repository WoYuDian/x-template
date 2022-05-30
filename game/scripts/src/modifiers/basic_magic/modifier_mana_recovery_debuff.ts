
import { rollDrops } from "../../game_logic/game_operation";
import { BaseModifier, registerModifier } from "../../lib/dota_ts_adapter";

@registerModifier()
export class modifier_mana_recovery_debuff extends BaseModifier {
    recoveryProbability: number
    recoveryPercentage: number
    OnCreated(params: object): void {
            this.recoveryProbability = this.GetAbility().GetLevelSpecialValueFor('recovery_probability', this.GetAbility().GetLevel() - 1)
            this.recoveryPercentage = this.GetAbility().GetLevelSpecialValueFor('recovery_percentage', this.GetAbility().GetLevel() - 1)   
    }

    OnRefresh(params: object): void {
        this.recoveryProbability = this.GetAbility().GetLevelSpecialValueFor('recovery_probability', this.GetAbility().GetLevel() - 1)
        this.recoveryPercentage = this.GetAbility().GetLevelSpecialValueFor('recovery_percentage', this.GetAbility().GetLevel() - 1)
    }

    DeclareFunctions(): ModifierFunction[] {
        return [ModifierFunction.ON_TAKEDAMAGE]
    }

    OnTakeDamage(event: ModifierInstanceEvent): void {
        if(event.attacker != this.GetAbility().GetOwner()) return;
        if(event.damage_type != DamageTypes.MAGICAL) return;

        if(RollPercentage(this.recoveryProbability * 100)) {
            ProjectileManager.CreateLinearProjectile({
                Ability: this.GetAbility(),
                EffectName: 'particles/skywrath_mage_concussive_shot_linear.vpcf',
                vSpawnOrigin	: event.unit.GetAbsOrigin(),
                fDistance		: 2000,
                fStartRadius	: 50,
                fEndRadius		: 50,
                Source			: event.unit,
                bHasFrontalCone	: false,
                //@ts-ignore
                bReplaceExisting: false,
                iUnitTargetTeam	: UnitTargetTeam.BOTH,
                iUnitTargetFlags: UnitTargetFlags.NONE,
                iUnitTargetType	: UnitTargetType.HERO,
                bDeleteOnHit    : true,
                fExpireTime     : GameRules.GetGameTime() + 5,
                //@ts-ignore
                vVelocity		: Vector(RandomInt(-200, 200), RandomInt(-200, 200), 0),
                bProvidesVision	: true,
                iVisionRadius	: 200	,
                iVisionTeamNumber: event.attacker.GetTeam(),
                ExtraData: {
                    mana_recovery: event.damage * this.recoveryPercentage
                }
            })
        }   


    }
}