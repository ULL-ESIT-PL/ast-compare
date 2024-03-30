import { strict as assert } from "assert";

import { compare } from "ast-compare";
import fs from "fs";

let x = process.argv[2] || "=";
// Find out, does an object/array/string/nested-mix is a subset or equal to another input:
let result = false;
try {
    let bigAST = fs.readFileSync("actual-a-equal-4.json").toString();
    bigAST = bigAST.replace("=", x);
    bigAST = JSON.parse(bigAST);
    let summaryAST = JSON.parse(fs.readFileSync("expected-a-equal-4.json", "utf8"));
    result = compare(bigAST, summaryAST, { verboseWhenMismatches: true });
}
catch (e) {
    console.error(`message=${e.message}`);
}
console.error(`comparison result = ${result}`);
