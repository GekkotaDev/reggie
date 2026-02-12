export type Tokens =
  | {
      "~kind": "GroupBegin";
      next?: Tokens;
    }
  | {
      "~kind": "GroupEnd";
      next?: Tokens;
    }
  | {
      "~kind": "Choice";
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
