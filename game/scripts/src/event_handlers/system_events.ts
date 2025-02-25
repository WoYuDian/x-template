import { Timers } from "../lib/timers";
import { checkGameTime } from "../game_logic/state_manager";
import { initPlayerAbilityInfo, addPlayerAbilityPoints } from "../game_logic/ability_manager";
import { rollDrops, recordUnitKill, recordHeroKill, createUnitInHomeForTest, openFowForTeam } from "../game_logic/game_operation";
import { heroLevelUp } from "../game_logic/realm_manager";
import { getPlayerHeroById, printObject } from "../util";

export function playerFullConnect(e: PlayerConnectFullEvent) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map') || {};
    playerMap[e.PlayerID.toString()] = {steamid: PlayerResource.GetSteamID(e.PlayerID).__tostring(), accountid: PlayerResource.GetSteamAccountID(e.PlayerID).toString(), level: 1}

    // for(let i = 0; i < 7; i++) {
    //     const bot = GameRules.AddBotPlayerWithEntityScript('', 'bot' + i, 7 + i,'', false)
    //     const id = i + 1;
    //     playerMap[id.toString()] = {steamid: PlayerResource.GetSteamID(id as PlayerID).__tostring(), accountid: PlayerResource.GetSteamAccountID(id as PlayerID).toString(), level: 1}
    // }
    
    print("Player :", e.PlayerID, ' connected, save result: ', CustomNetTables.SetTableValue('player_info', 'player_map', playerMap))
}

export function gameStateChange(e: DotaGameStateChangeEvent) {
    if(e.new_state == 4) {
        Timers.CreateTimer(function() {
            checkGameTime()
            return 1
        })
        initPlayerAbilityInfo()
    }
}

export function playerLevelUp(e: DotaPlayerGainedLevelEvent) {
    addPlayerAbilityPoints(e.PlayerID)
    heroLevelUp(e.PlayerID)
}

export function onEntityKilled(e: EntityKilledEvent) {
    const killedUnit = EntIndexToHScript(e.entindex_killed);
    const attachker = EntIndexToHScript(e.entindex_attacker);
    
    if(killedUnit.IsBaseNPC() && killedUnit.IsCreature() && (attachker.GetTeam() != DotaTeam.NEUTRALS)) {
        
        recordUnitKill(killedUnit, PlayerResource.GetNthPlayerIDOnTeam(attachker.GetTeam(), 1))
        rollDrops(killedUnit)
    } else if (killedUnit.IsBaseNPC() && killedUnit.IsHero() && (killedUnit.GetTeam() != DotaTeam.NEUTRALS) && (attachker.GetTeam() != DotaTeam.NEUTRALS)) {
        recordHeroKill(killedUnit, PlayerResource.GetNthPlayerIDOnTeam(attachker.GetTeam(), 1))
    }
}

export function onMoneyChanged(event: DotaItemPurchasedEvent | {PlayerID: PlayerID} | DotaHeroInventoryItemChangeEvent | any) {  
    if(!event.PlayerID && !event.player_id) return;
    if(!PlayerResource || !PlayerResource.GetPlayer) return;
    CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(event.PlayerID || event.player_id), 'player_money_changed', {playerId: event.PlayerID || event.player_id})
}