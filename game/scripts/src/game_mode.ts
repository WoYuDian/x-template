import { reloadable } from "./lib/tstl-utils";
import * as systemEventHandlers from './event_handlers/system_events'
import * as customEventHandlers from './event_handlers/custom_events'

declare global {
    interface CDOTAGamerules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {
        PrecacheResource("particle", "particles/units/heroes/hero_meepo/meepo_earthbind_projectile_fx.vpcf", context);
        PrecacheResource("soundfile", "soundevents/game_sounds_heroes/game_sounds_meepo.vsndevts", context);
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


        const gamemode = GameRules.GetGameModeEntity();
        gamemode.SetFogOfWarDisabled(true)
        gamemode.SetCameraDistanceOverride(1234)

        const _this = this;
        ListenToGameEvent('player_connect_full', systemEventHandlers.playerFullConnect, this)

        ListenToGameEvent('dota_game_state_change', systemEventHandlers.gameStateChange, this)

        CustomGameEventManager.RegisterListener('player_hero_selection', customEventHandlers.playerHeroSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_plan_selection', customEventHandlers.playerPlanSelection.bind(this))
        CustomGameEventManager.RegisterListener('player_relic_selection', customEventHandlers.playerRelicSelection.bind(this))
    }

    
    public Reload() {
        print("Script reloaded!");
    }
}