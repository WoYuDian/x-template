import { Timers } from "../lib/timers";

export function playerFullConnect(e: PlayerConnectFullEvent) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map') || {};

    playerMap[e.PlayerID] = true;

    print("Player :", e.PlayerID, ' connected, save result: ', CustomNetTables.SetTableValue('player_info', 'player_map', playerMap))
}

export function gameStateChange(e: DotaGameStateChangeEvent) {

    if(e.new_state == 4) {
        Timers.CreateTimer(function() {
            print('herer+++')
            return 1
        })
    }
}