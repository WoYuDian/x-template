import { cacheGet, cacheUpdate } from "../cache";
import { stateInfo } from "../common_type";
import { checkGameFinish, openFowForTeam } from "../game_logic/game_operation";
import { BaseAbility, registerAbility } from "../lib/dota_ts_adapter"
@registerAbility()
export class global_light_bolt extends BaseAbility
{
    OnSpellStart(): void {                
        if(IsServer()) {
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
        }
    }

    OnProjectileHit(target: CDOTA_BaseNPC, location: Vector): boolean | void {
        if(target.GetTeam() != this.GetCaster().GetTeam()) {
            const stateInfo: stateInfo = cacheGet('gameStateInfo')
            const roundCount = stateInfo.round_count
            const damage = roundCount * 100

            ApplyDamage({
                victim: target,
                attacker: this.GetCaster(),
                damage: damage,
                damage_type: DamageTypes.PURE,
                damage_flags: DamageFlag.NONE,
                ability: this
            })

            if(!target.IsAlive()) {
                const playerId = target.GetPlayerOwnerID()
                if(!stateInfo.player_score[playerId.toString()]) {
                    stateInfo.player_score[playerId.toString()] = {dead: 0, time: 0}
                }

                stateInfo.player_score[playerId.toString()].dead = 1
                stateInfo.player_score[playerId.toString()].time = GameRules.GetGameTime()
                openFowForTeam(target.GetTeamNumber())
                cacheUpdate('gameStateInfo')

                checkGameFinish()
            }
            EmitSoundOn('Hero_Zuus.GodsWrath.Target', target)
        }
    }
}