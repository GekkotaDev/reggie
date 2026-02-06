import type { Tokens } from "~/lexer/types";

export const lex = (
  strings: TemplateStringsArray,
  ...values: string[]
): Tokens => lexString(String.raw({ raw: strings }, ...values));

export const lexString = (regex: string): Tokens =>
  regex
    .split("")
    .map((character) =>
      match(character)
        .with(
          "(",
          () =>
            ({
              "~kind": "GroupBegin",
            }) as const,
        )
        .with(
          ")",
          () =>
            ({
              "~kind": "GroupEnd",
            }) as const,
        )
        .with(
          "+",
          () =>
            ({
              "~kind": "Choice",
            }) as const,
        )
        .with(
          "*",
          () =>
            ({
              "~kind": "KleeneClosure",
            }) as const,
        )
        .otherwise(
          (character) =>
            ({
              "~kind": "Symbol",
              character,
            }) as const,
        ),
    )
    .reduce((current, next) => ({
      ...current,
      next,
    }));

const foo = lex`(aa+bb)(a+b)*`;
