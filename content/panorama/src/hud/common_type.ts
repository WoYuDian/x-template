export type CustomTableType<
    TName extends keyof CustomNetTableDeclarations,
    T extends keyof CustomNetTableDeclarations[TName]
    > = CustomNetTableDeclarations[TName][T]

export type RankNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'