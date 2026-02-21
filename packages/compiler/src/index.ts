import { lexString } from "~/lexer/lexer";
import { parse } from "~/ast/ast";

const string = "(bab)*(b+a)(bab+aba)(a+b)*(aa+bb)*(b+a+bb)(a+b)*(aa+bb)";

console.log(string);

console.dir(lexString(string), { depth: 16 });
console.warn("> next");
console.dir(parse(lexString(string)), { depth: 8 });
