import { cacheGet, cacheUpdate, CustomTableType } from "../cache";
import { clearUnitAbility, openFowForTeam, setHeroInnateAbility, teleportPlayerToHome } from '../game_logic/game_operation'
import { breakRealm } from '../game_logic/realm_manager'
import * as stateConfiguration from '../game_logic/configuration/game_state.json'

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
            AddFOWViewer(hero.GetTeamNumber(), Vector(0, 0, 0), 2048, 10000000, false)
            clearUnitAbility(hero)
            setHeroInnateAbility(hero)
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
        stateInfo.relic_selection_info[event.playerId.toString()] = {relic_name: event.relicName, index: event.index};
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

export function playerPickAward(event: {playerId: PlayerID, index: number}) {
    const stateInfo: GameStateInfo = cacheGet('gameStateInfo')
    const awardInfo = stateInfo.rank_award_info.award_map[event.index]
    const playerRankInfo = stateInfo.player_rank_info   
    
    let playerRank = 8, selectedPlayerRank = 0
    for(let i = 1; i <= 8; i++) {
        if(playerRankInfo[i] == event.playerId.toString()) {
            playerRank = i
        }
        if(playerRankInfo[i] == awardInfo.player_id) {
            selectedPlayerRank = i
        }
    }

    const timeWindow = playerRank * stateConfiguration.rank_duration / 8;
    let canPick = true;
    
    if(awardInfo.player_id) {
        if(playerRank > selectedPlayerRank) {
            canPick = false
        }
    }
    if(timeWindow < (GameRules.GetGameTime() - stateInfo.last_round_time)) {
        canPick = false;
    }

    if(canPick) {        
        const awardMap = stateInfo.rank_award_info.award_map
        for(let i = 1; i <= 8; i++) {
            if(awardMap[i].player_id == event.playerId.toString()) {
                awardMap[i].player_id = null
            }                
        }

        stateInfo.rank_award_info.award_map[event.index].player_id = event.playerId.toString()
        print(`Player: ${event.playerId} pick award: ${awardInfo.name}`)
    } else {
        print(`Player: ${event.playerId} pick award ${awardInfo.name} failed`)
    }
}