declare interface CustomGameEventDeclarations {
    player_hero_selection: {heroName: string, playerId: PlayerID};
    player_plan_selection: {planName: string, playerId: PlayerID};
    player_relic_selection: {relicName: string, playerId: PlayerID};
}