import { lexString } from "./lexer/lexer";
import { parse } from "./ast/ast";

export { lexString, lex } from "./lexer/lexer";
export { parse } from "./ast/ast";
export type { Node } from "./ast/types";

const string = "(aa+bb)(a+b)*";

console.log(string);

console.dir(lexString(string), { depth: 16 });
console.warn("> next");
console.dir(parse(lexString(string)), { depth: 8 });
