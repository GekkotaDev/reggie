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
      "~kind": "KleeneClosure";
      next?: Tokens;
    }
  | {
      "~kind": "Symbol";
      character: string;
      next?: Tokens;
    };
