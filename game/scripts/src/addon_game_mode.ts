require('utils/aeslua');
require('utils/decrypt');
require('lib/vector_targeting')
//@ts-ignore
let GameMode = require('game_mode').GameMode

Object.assign(getfenv(), {
    Activate: GameMode.Activate,
    Precache: GameMode.Precache,
});

if (GameRules.Addon) {
    GameRules.Addon.Reload();
}