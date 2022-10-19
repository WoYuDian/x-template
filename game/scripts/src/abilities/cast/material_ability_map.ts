import { ma_freeze } from "./material_abilities/ma_freeze/ma_freeze";
import { ma_ignite } from "./material_abilities/ma_ignite/ma_ignite";
import { ma_lifesteal } from "./material_abilities/ma_lifesteal/ma_lifesteal";
import { ma_magnetism } from "./material_abilities/ma_magnetism/ma_magnetism";
import { ma_poison } from "./material_abilities/ma_poison/ma_poison";
import { ma_shehun } from "./material_abilities/ma_shehun/ma_shehun";
import { ma_thunder_pulse } from "./material_abilities/ma_thunder_pulse/ma_thunder_pulse";

export const materialAbilityMap = {
    1: ma_ignite.name,
    2: ma_thunder_pulse.name,
    3: ma_magnetism.name,
    4: ma_freeze.name,
    5: ma_poison.name,
    6: ma_shehun.name,
    7: ma_lifesteal.name
}