type NetworkedData<T> = T extends string | number
    ? T
    : T extends boolean
    ? 0 | 1
    : T extends (infer U)[]
    ? { [key: number]: NetworkedData<U> }
    : T extends Function // eslint-disable-line @typescript-eslint/ban-types
    ? undefined
    : T extends object
    ? { [K in keyof T]: NetworkedData<T[K]> }
    : never;

export type CustomTableType<
    TName extends keyof CustomNetTableDeclarations,
    T extends keyof CustomNetTableDeclarations[TName]
    > = NetworkedData<CustomNetTableDeclarations[TName][T]>

export type RankNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8';

export type ForceOfRule = 'metal' | 'wood' | 'water' | 'fire' | 'rock' | 'body' | 'spirit';

export type userNameMap = {[playerId: string]: string}

export type playerAccount = {lingshi: number}

export type dropMap = {
    [unit_name: string]: {
        level: number,
        drops: {name: string, chance: number}[]
    }
}