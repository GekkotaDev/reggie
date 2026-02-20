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
              "~kind": "UnionBegin",
            }) as const,
        )
        .with(
          ")",
          () =>
            ({
              "~kind": "UnionEnd",
            }) as const,
        )
        .with(
          "+",
          () =>
            ({
              "~kind": "Or",
            }) as const,
        )
        .with(
          "*",
          () =>
            ({
              "~kind": "Closure",
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
    .reduceRight((current, next) => ({
      ...next,
      next: current,
    }));
