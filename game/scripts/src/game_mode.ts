import { reloadable } from "./lib/tstl-utils";
import * as systemEventHandlers from './event_handlers/system_events'
import * as customEventHandlers from './event_handlers/custom_events'
import { loadAbilityGraph, getBookRoot } from './ability_graph/graph_helper'
import {printObject, MapWearables, GenerateDefaultBlock, GenerateBundleBlock} from './util'
import * as abilityHandlers from './game_logic/ability_manager'
import {precacheAllResource} from './precache'
declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {        
        const units = LoadKeyValues("scripts/npc/npc_units_custom.txt")
        for(const key in units) {
            PrecacheUnitByNameAsync(key, function() {})
        }        

        precacheAllResource(context)
    }

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 0);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 0);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_1, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_2, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_3, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_4, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_5, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_6, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_7, 1);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.CUSTOM_8, 1);

        GameRules.SetHeroSelectionTime(0)  
        GameRules.SetHeroSelectPenaltyTime(0)
        GameRules.SetStrategyTime(0)
        GameRules.SetShowcaseTime(0);
        GameRules.SetPreGameTime(0);        
        GameRules.SetStartingGold(8000)
        GameRules.LockCustomGameSetupTeamAssignment(false)

        //@ts-ignore
        GameRules.DropTable = LoadKeyValues('scripts/kv/item_drops.kv')

        const gamemode = GameRules.GetGameModeEntity();
        // gamemode.SetFogOfWarDisabled(true)
        // gamemode.SetUnseenFogOfWarEnabled(true)
        gamemode.SetCameraDistanceOverride(1234)
        gamemode.SetUseCustomHeroLevels(true)
        gamemode.SetCustomHeroMaxLevel(100)
        let xpConf = []
        let curXp = 0
        for(let i = 0; i < 100; i++) {            
            if((i + 1) % 5 == 0) {
                curXp = curXp + 500000
                xpConf.push(curXp)
            } else {
                curXp = curXp + i * 200
                xpConf.push(curXp)
            }            
        }
        gamemode.SetCustomXPRequiredToReachNextLevel(xpConf)

        ListenToGameEvent('player_connect_full', systemEventHandlers.playerFullConnect, this)

        ListenToGameEvent('dota_game_state_change', systemEventHandlers.gameStateChange, this)

        ListenToGameEvent('dota_player_gained_level', systemEventHandlers.playerLevelUp, this)
        
        ListenToGameEvent('entity_killed', systemEventHandlers.onEntityKilled, this)

        CustomGameEventManager.RegisterListener('player_hero_selection', customEventHandlers.playerHeroSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_plan_selection', customEventHandlers.playerPlanSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_relic_selection', customEventHandlers.playerRelicSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_upgrade_ability', abilityHandlers.playerUpgradeAbility.bind(this))
        CustomGameEventManager.RegisterListener('player_challenge_selection', customEventHandlers.playerChallengeSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_break_realm', customEventHandlers.playerBreakRealm.bind(this))
        loadAbilityGraph()     

        // MapWearables()
        // Convars.RegisterCommand('gwb',function(name, args) {
        //     print(args,'========')
        //     GenerateBundleBlock(args)
        // }, 'Print bundle codes', ConVarFlags.DEMO)

        // Convars.RegisterCommand('ghdb',function(name, args) {
        //     GenerateDefaultBlock(args)
        // }, 'Print hero defalt bundle codes', ConVarFlags.DEMO)
    }

    
    public Reload() {
        print("Script reloaded!");
    }
}