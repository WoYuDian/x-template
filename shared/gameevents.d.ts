declare interface CustomGameEventDeclarations {
    player_hero_selection: {heroName: string, playerId: PlayerID};
    player_plan_selection: {planName: string, playerId: PlayerID};
    player_relic_selection: {relicName: string, playerId: PlayerID};
    player_upgrade_ability: {abilityName: string, playerId: PlayerID};
    player_challenge_selection: {playerId: PlayerID, targetPlayerId: PlayerID};
    player_break_realm: {playerId: PlayerID};
}