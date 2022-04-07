export function teleportPlayerToHome(playerId: PlayerID) {
    const player = PlayerResource.GetPlayer(playerId);

    if(player) {
        const hero = player.GetAssignedHero()

        if(hero) {
            hero.RespawnHero(false, false)
            CenterCameraOnUnit(playerId, hero)
        }
    }
    
}