import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter"
@registerAbility()
export class global_light_bolt extends BaseAbility
{
    
    OnSpellStart(): void {                
        // if(IsServer()) {
            const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map')
            ProjectileManager.CreateTrackingProjectile({
                Target: this.GetCaster(),
                Source: this.GetCaster(),
                Ability: this,
                EffectName: 'particles/econ/items/zeus/arcana_chariot/zeus_arcana_thundergods_wrath_start_bolt_parent.vpcf',
                bDodgeable: false,
                bProvidesVision: true,
                iMoveSpeed: 2000,
                iVisionRadius: 300,
                iVisionTeamNumber: this.GetCaster().GetTeamNumber()
            })

            for(const key in playerMap) {
                const player = PlayerResource.GetPlayer(parseInt(key) as PlayerID)
                const playerHero = player.GetAssignedHero();

                if(playerHero && playerHero.IsAlive()) {
                    ProjectileManager.CreateTrackingProjectile({
                        Target: playerHero,
                        vSourceLoc: playerHero.GetAbsOrigin(),
                        Source: playerHero,
                        Ability: this,
                        EffectName: 'particles/econ/items/zeus/arcana_chariot/zeus_arcana_thundergods_wrath_start_bolt_parent.vpcf',
                        bDodgeable: false,
                        iMoveSpeed: 2000
                    })                                                  
                }
            }
        // }
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target.GetTeam() != this.GetCaster().GetTeam()) {
            ApplyDamage({
                victim: target,
                attacker: this.GetCaster(),
                damage: 30,
                damage_type: DamageTypes.PURE,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            print(target.IsAlive())
            EmitSoundOn('Hero_SkywrathMage.ArcaneBolt.Cast', target);
        }
    }
}