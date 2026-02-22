import type { Tokens } from "~/lexer/types";
import type { Node, Union, Match, Closure } from "~/ast/types";

export const parse = Object.assign((tokens: Tokens) => parse.map(tokens), {
  map: (tokens: Tokens): Node[] =>
    match(tokens)
      .with({ "~kind": "UnionBegin" }, (token) =>
        token?.next === undefined ? [] : parse.map(token.next),
      )
      .with({ "~kind": "Symbol" }, (symbol) =>
        flow(
          (token: typeof symbol) => parse.union({ tokens: token }),
          ({ token, union }) =>
            match(token?.next)
              .with(P.nullish, () => [union])
              .with({ "~kind": "Closure" }, (next) => [
                {
                  type: "Closure",
                  union,
                } as const satisfies Closure,
                ...parse.map(next),
              ])
              .otherwise((next) => [union, ...parse.map(next)]),
        )(symbol),
      )
      .otherwise((token) => (token.next ? parse.map(token.next) : [])),

  union: ({
    tokens,
  }: {
    tokens: Tokens;
  }): {
    token: Tokens;
    union: Union;
  } =>
    match(tokens)
      .with({ "~kind": "UnionBegin" }, () => ({
        token: tokens,
        union: {
          type: "Union",
          choices: [parse.union({ tokens: tokens.next! }).union],
        } as const satisfies Union,
      }))
      .with({ "~kind": "Or" }, () => parse.union({ tokens: tokens.next! }))
      .with({ "~kind": "Symbol" }, (symbol) =>
        flow(
          (token: typeof symbol) => ({
            token,

            walk: (token: Tokens): Match[] =>
              flatRecurse(token)((token, map): Match[] =>
                token["~kind"] === "Symbol"
                  ? [
                      { type: "Match", letter: token.character } as const,
                      ...map(token.next!, map),
                    ]
                  : [],
              ),

            next: {
              union: (token: Tokens): Tokens =>
                flatRecurse(token)(
                  (token, map): Tokens =>
                    token["~kind"] !== "UnionEnd"
                      ? map(token.next!, map)
                      : token?.next === undefined
                        ? token
                        : token.next["~kind"] === "UnionBegin"
                          ? token
                          : token.next["~kind"] !== "Closure"
                            ? map(token.next, map)
                            : token.next?.next === undefined
                              ? token
                              : token.next.next["~kind"] === "UnionBegin"
                                ? token
                                : map(token.next.next, map),
                ),

              group: (token: Tokens): Tokens =>
                flatRecurse(token)(
                  (token, map): Tokens =>
                    token["~kind"] !== "Symbol" ? token : map(token.next!, map),
                ),
            },
          }),
          (constants) => ({
            ...constants,
          }),
          ({ token, walk: walk, next: next }) => ({
            token: next.union(token),
            union: {
              type: "Union",
              choices: [
                {
                  type: "Group",
                  matches: [
                    {
                      type: "Match",
                      letter: token.character,
                    },
                    ...walk(token.next!),
                  ],
                },
                ...parse.union({ tokens: next.group(token) }).union.choices,
              ],
            } as const satisfies Union,
          }),
        )(symbol),
      )
      .otherwise(() => ({
        token: tokens,
        union: {
          type: "Union",
          choices: [],
        } as const satisfies Union,
      })),
});
