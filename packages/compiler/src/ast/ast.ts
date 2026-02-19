import type { Tokens } from "~/lexer/types";
import type { Nodes, Union, Group, Match } from "~/ast/types";

export const parse = Object.assign(
  (tokens: Tokens) =>
    match(tokens)
      .with({ "~kind": "UnionBegin" }, ({}) => ({
        type: "Group" as const,
        children: tokens?.next ? [parse.union({ tokens })] : [],
      }))
      .with({ "~kind": "UnionEnd" }, () => ({}))
      .with({ "~kind": "Closure" }, () => ({}))
      .with({ "~kind": "Or" }, () => ({}))
      .with({ "~kind": "Symbol" }, () => ({}))
      .exhaustive(),
  {
    map: () => {},

    union: ({ tokens, parent }: { tokens: Tokens; parent?: Union }): Union =>
      match(tokens)
        .with(
          { "~kind": "UnionBegin" },
          () =>
            ({
              type: "Union",
              choices: [parse.union({ tokens: tokens.next!, parent })],
            }) as const satisfies Union,
        )
        .with({ "~kind": "UnionEnd" }, () =>
          tokens?.next && tokens.next["~kind"] === "Closure"
            ? parse.union({ tokens, parent })
            : ({
                type: "Union",
                choices: [],
              } as const satisfies Union),
        )
        .with({ "~kind": "Symbol" }, (symbol) =>
          flow(
            (token: typeof symbol) => ({ token }),
            (constants) => ({
              ...constants,

              walk(token: Tokens): Match[] {
                return token["~kind"] === "Symbol"
                  ? [
                      { type: "Match", letter: token.character } as const,
                      ...this.walk(token),
                    ]
                  : [];
              },

              next(token: Tokens): Tokens {
                return token["~kind"] !== "Symbol"
                  ? token
                  : this.next(token.next!);
              },
            }),
            ({ token, walk, next }) =>
              ({
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
                  ...parse.union({ tokens: next(token), parent }).choices,
                ],
              }) as const satisfies Union,
          )(symbol),
        )
        .with({ "~kind": "Or" }, () =>
          parse.union({ tokens: tokens.next!, parent }),
        )
        .with(
          { "~kind": "Closure" },
          () =>
            ({
              type: "Union",
              choices: [],
            }) as const satisfies Union,
        )
        .exhaustive(),
  },
);
