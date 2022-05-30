import { cacheGet, cacheUpdate, CustomTableType } from "../cache";
import { teleportPlayerToHome } from '../game_logic/game_operation'
import { breakRealm } from '../game_logic/realm_manager'

type GameStateInfo = CustomTableType<'game_state_info', 'state_info'>
export function playerHeroSelection(event) {    
    if(!event.heroName.find('npc_dota_hero_')) {
        event.heroName = 'npc_dota_hero_' + event.heroName
    }
  
    const stateInfo: GameStateInfo = cacheGet('gameStateInfo')
    const playerSelection = stateInfo.hero_selection_info || {}

            
    if(!playerSelection || !playerSelection.hero_selection_info || !playerSelection.hero_selection_info[event.playerId.toString()]) {
        playerSelection[event.playerId.toString()] = {hero_name: event.heroName}
        
        stateInfo.hero_selection_info = playerSelection;
        print('Set the player hero selection result: ', cacheUpdate('gameStateInfo'))
        const player = PlayerResource.GetPlayer(event.playerId);
        if(player) {
            player.SetSelectedHero(event.heroName)
            const playerLocation = CustomNetTables.GetTableValue('player_configuration', 'player_location')[event.playerId.toString()].center
            const hero = CreateHeroForPlayer(event.heroName, player)
            hero.SetControllableByPlayer(event.playerId, true);
            hero.SetRespawnsDisabled(true)
            hero.SetAbilityPoints(-100)
            
            CenterCameraOnUnit(event.playerId, hero)
            player.SetAssignedHeroEntity(hero)
            teleportPlayerToHome(event.playerId)            
        }


    }
}

export function playerPlanSelection(event) {
    const stateInfo: GameStateInfo = cacheGet('gameStateInfo')

    if(!stateInfo.plan_selection_info[event.playerId.toString()]) {
        stateInfo.plan_selection_info[event.playerId.toString()] = {plan_name: event.planName};
        print('Set the player plan selection result: ', cacheUpdate('gameStateInfo'))
    } else {
        print('Plan already selected.')
    }
}

export function playerRelicSelection(event) {
    const stateInfo: GameStateInfo = cacheGet('gameStateInfo')

    if(!stateInfo.relic_selection_info[event.playerId.toString()]) {
        stateInfo.relic_selection_info[event.playerId.toString()] = {relic_name: event.relicName};
        print('Set the player relic selection result: ', cacheUpdate('gameStateInfo'))
    } else {
        print('Relic already selected.')
    }
}

export function playerChallengeSelection(event: {playerId: PlayerID, targetPlayerId: PlayerID}) {
    const stateInfo: GameStateInfo = cacheGet('gameStateInfo')
    stateInfo.challenge_selection_info[event.playerId.toString()] = event.targetPlayerId.toString();
    print('Set the player challenge selection result: ', cacheUpdate('gameStateInfo'))
}

export function playerBreakRealm(event: {playerId: PlayerID}) {
    breakRealm(event.playerId)
    print('Player break realm: ', event.playerId)
}