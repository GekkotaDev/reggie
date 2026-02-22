import { lexString } from "~/lexer/lexer";
import { parse } from "~/ast/ast";

const string = "(aa+bb)(a+b)*";

console.log(string);

console.dir(lexString(string), { depth: 16 });
console.warn("> next");
console.dir(parse(lexString(string)), { depth: 8 });
