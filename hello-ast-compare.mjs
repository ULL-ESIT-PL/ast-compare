import { strict as assert } from "assert";

import { compare } from "ast-compare";

let x = process.argv[2] || "d";
// Find out, does an object/array/string/nested-mix is a subset or equal to another input:
let result = false;
try {
    result = compare(
        {
            a: {
            b: x,
            c: [],
            e: "f",
            g: "h",
            },
        },
        {
            a: {
            b: "d",
            c: [],
            e: "f",
            },
        },
        {
            verboseWhenMismatches
        }
    )    
}
catch (e) {
    console.error(`message=${e.message}`);
}
console.error(`comparison result = ${result}`);
