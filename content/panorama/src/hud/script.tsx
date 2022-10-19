import React, { createElement } from 'react';
import { render } from '@demon673/react-panorama';
import {UIBody} from './ui'

GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_TIMEOFDAY, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_HEROES, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false)

// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PANEL, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_ITEMS, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_QUICKBUY, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_COURIER, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PROTECT, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_GOLD, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_SHOP_SUGGESTEDITEMS, false)
// GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_SHOP_COMMONITEMS, false)

GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_MENU_BUTTONS, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_BACKGROUND, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_RADIANT_TEAM, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_DIRE_TEAM, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR_SCORE, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ENDGAME, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ENDGAME_CHAT, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_AGHANIMS_STATUS, false)
GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ELEMENT_COUNT, false)
const rootPanel = $.GetContextPanel().GetParent()?.GetParent();

if(rootPanel) {
    rootPanel.style.zIndex = 0;
}

// const ShopButton = rootPanel?.GetParent()?.FindChildTraverse('ShopButton')
// if(ShopButton) {
//     ShopButton.style.visibility = 'collapse'
//     ShopButton.ApplyStyles(true)    
// }

// const courier = rootPanel?.GetParent()?.FindChildTraverse('courier')
// if(courier) {
//     courier.style.visibility = 'collapse'
//     courier.ApplyStyles(true)    
// }

const tpSlot = rootPanel?.GetParent()?.FindChildTraverse('StickyItemSlotContainer')
if(tpSlot) {
    tpSlot.style.visibility = 'collapse'
    tpSlot.ApplyStyles(true)    
}

// const upgradesTab = rootPanel?.GetParent()?.FindChildTraverse('GridUpgradesTab')
// if(upgradesTab) {
//     upgradesTab.style.visibility = 'collapse'
//     upgradesTab.ApplyStyles(true)
// }

const neutralsTab = rootPanel?.GetParent()?.FindChildTraverse('GridNeutralsTab')
if(neutralsTab) {
    neutralsTab.style.visibility = 'collapse'
    neutralsTab.ApplyStyles(true)
}

const commmonItemsPanel = rootPanel?.GetParent()?.FindChildTraverse('CommonItems')
if(commmonItemsPanel) {
    commmonItemsPanel.style.visibility = 'collapse'
    commmonItemsPanel.ApplyStyles(true)
}

render(<UIBody/>, $.GetContextPanel());

// Game.AddCommand( "+KeySpace", OnExecuteAbility1ButtonPressed, "", 0 );
// function OnExecuteAbility1ButtonPressed()
// {
//     var queryUnit = Players.GetLocalPlayerPortraitUnit();
//     var ability = Entities.GetAbility( queryUnit, 0 );
//     Abilities.ExecuteAbility(ability, queryUnit, false)
//     Abilities.GetKeybind
// }
