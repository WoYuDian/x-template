type cacheKeys = 'gameStateInfo' | 'playerAbilityInfo' | 'battleInfo'


const netTableMap = {
    'gameStateInfo': ['game_state_info', 'state_info'],
    'playerAbilityInfo': ['player_ability_info', 'ability_info'],
}
export type CustomTableType<
    TName extends keyof CustomNetTableDeclarations,
    T extends keyof CustomNetTableDeclarations[TName]
    > = CustomNetTableDeclarations[TName][T]

const gameStateInfo: CustomTableType<'game_state_info', 'state_info'> = null;
const playerAbilityInfo: CustomTableType<'player_ability_info', 'ability_info'> = null;

const Cache = {gameStateInfo, playerAbilityInfo}
export function cacheGet(key: cacheKeys) {
    return Cache[key];
}

export function cacheSet(key: cacheKeys, value) {
    Cache[key] = value;
}

export function cacheUpdate(key: cacheKeys) {
    return CustomNetTables.SetTableValue(netTableMap[key][1], netTableMap[key][2], Cache[key])
}