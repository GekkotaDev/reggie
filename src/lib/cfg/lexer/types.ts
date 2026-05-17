export type Tokens =
  | {
      "~kind": "UnionBegin";
      next?: Tokens;
    }
  | {
      "~kind": "UnionEnd";
      next?: Tokens;
    }
  | {
      "~kind": "Or";
      next?: Tokens;
    }
  | {
      "~kind": "Closure";
      next?: Tokens;
    }
  | {
      "~kind": "Symbol";
      character: string;
      next?: Tokens;
    };
