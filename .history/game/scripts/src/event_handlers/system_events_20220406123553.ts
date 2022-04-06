export function playerFullConnect(e: PlayerConnectFullEvent) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map') || {};

    playerMap[e.PlayerID] = true;

    print("Player :", e.PlayerID, ' connected, save result: ', CustomNetTables.SetTableValue('player_info', 'player_map', playerMap))
}

export function gameStateChange(e: DotaGameStateChangeEvent) {
    print(e.new_state, '+++++++++', e.old_state)
    // if(e.old_state == 5)
}