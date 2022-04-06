export function playerFullConnect(e: PlayerConnectFullEvent) {
    const playerMap = CustomNetTables.GetTableValue('player_info', 'player_map') || {};

    playerMap[e.PlayerID] = true;

    print("Player :", e.PlayerID, ' connected, save result: ', CustomNetTables.SetTableValue('player_info', 'player_map', playerMap))
}

export function gameStateChange() {

}