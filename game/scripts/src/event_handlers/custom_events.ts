import { cacheGet, cacheUpdate, CustomTableType } from "../cache";

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
            hero.SetRespawnPosition(Vector(playerLocation.x - 1024, playerLocation.y + 1024, playerLocation.z))
            hero.RespawnHero(false, true)
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.AddAbility('abaddon_death_coil')
            hero.RemoveAbility('abaddon_death_coil')
            CenterCameraOnUnit(event.playerId, hero)
            player.SetAssignedHeroEntity(hero)                  
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