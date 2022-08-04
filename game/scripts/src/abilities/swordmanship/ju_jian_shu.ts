import { getForceOfRuleLevel } from "../../game_logic/realm_manager";
import { BaseAbility, registerAbility } from "../../lib/dota_ts_adapter"
import { Timers } from "../../lib/timers";
import { modifier_sword_mean_stacking } from "../../modifiers/swordmanship/sword_mean_stacking"
import { modifier_ju_jian_shu } from "../../modifiers/swordmanship/ju_jian_shu";
@registerAbility()
export class ju_jian_shu extends BaseAbility
{    
    OnSpellStart(): void {                
        // if(IsServer()) {
            const owner = this.GetOwner()

            if(owner.IsBaseNPC() && owner.HasModifier(modifier_sword_mean_stacking.name)) {
                const swordMeanModifier = owner.FindModifierByName(modifier_sword_mean_stacking.name);

                //@ts-ignore
                swordMeanModifier.updateAbilityState()
                if(swordMeanModifier.GetStackCount() < this.GetSpecialValueFor('charge_cost')) {
                    return
                } else {
                    swordMeanModifier.SetStackCount(swordMeanModifier.GetStackCount() - this.GetSpecialValueFor('charge_cost'))
                    //@ts-ignore
                    swordMeanModifier.updateAbilityState()
                }                
            } else {
                return;
            }

            let vPos
            if(this.GetCursorTarget()) {
                vPos = this.GetCursorTarget().GetOrigin()
            } else {
                vPos = this.GetCursorPosition()
            }

            const caster = this.GetCaster();

            Timers.CreateTimer(this.GetSpecialValueFor('delay'), (function() {
                spawnSword(vPos, caster)

                Timers.CreateTimer(0.2, (function() {
                    const radius = this.GetSpecialValueFor('radius')
                    const enemies = FindUnitsInRadius(
                        caster.GetTeamNumber(), 
                        vPos, 
                        null, 
                        radius, 
                        UnitTargetTeam.ENEMY, 
                        UnitTargetType.BASIC + UnitTargetType.HERO, 
                        UnitTargetFlags.NONE,
                        FindOrder.ANY,
                        false)
    
                    const damage = this.GetSpecialValueFor('damage_factor') * getForceOfRuleLevel('metal', caster);
                    for(const enemy of enemies) {
                        ApplyDamage({
                            victim: enemy,
                            attacker: caster,
                            damage: damage,
                            damage_type: DamageTypes.MAGICAL,
                            damage_flags: DamageFlag.NONE,
                            ability: this
                        })
                    }
                }).bind(this))
            }).bind(this))
    }

    IsHidden(): boolean {
        return false
    }

    GetCastRange(location: Vector, target: CDOTA_BaseNPC): number {
        return this.GetSpecialValueFor('cast_range')
    }
}

export function spawnSword(position: Vector, caster: CDOTA_BaseNPC) {
    if(!caster.IsHero()) return;

    const ability = caster.FindAbilityByName(ju_jian_shu.name)
    if(!ability) return;

    // const nFXIndex = ParticleManager.CreateParticle( "particles/ju_jian_shu/ju_jian_shu.vpcf", ParticleAttachment.POINT, caster )
    // ParticleManager.SetParticleControlEnt( nFXIndex, 0, null, ParticleAttachment.POINT, null, position, true )
    // ParticleManager.ReleaseParticleIndex( nFXIndex )

    const sword = CreateUnitByName('ju_jian_shu_unit', 
    position, 
    false, 
    null, 
    PlayerResource.GetPlayer(caster.GetPlayerID()), 
    caster.GetTeamNumber()
    )    

    sword.AddNewModifier(
        caster, 
        ability, 
        modifier_ju_jian_shu.name, 
        {size: 3, duration: ability.GetSpecialValueFor('life_factor') * getForceOfRuleLevel('metal', caster)}
    )

    sword.AddNewModifier(
        caster, 
        ability, 
        'modifier_kill', 
        {duration: ability.GetSpecialValueFor('life_factor') * getForceOfRuleLevel('metal', caster)}
    )



    sword.SetMoveCapability(UnitMoveCapability.NONE)
    sword.SetControllableByPlayer(caster.GetPlayerOwnerID(), false);
}