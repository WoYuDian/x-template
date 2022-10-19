import { CustomTableType } from "./cache";

export type stateInfo = CustomTableType<'game_state_info', 'state_info'>
export type stateKeyType<key extends keyof stateInfo> = stateInfo[key]