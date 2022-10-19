import { modifier_common_ai } from "./modifiers/creep/modifier_common_ai";
import { modifier_practice_creep } from "./modifiers/creep/modifier_practice_creep";

export const modifierMap = {
    [modifier_practice_creep.name]: modifier_practice_creep.name,
    [modifier_common_ai.name]: modifier_common_ai.name
}