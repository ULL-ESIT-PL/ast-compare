## Install

This package is [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). If you're not ready yet, install an older version of this program, 2.1.0 (`npm i ast-compare@2.1.0`).

```bash
npm i ast-compare
```

## AST comparison

See [compare-ast.mjs](compare-ast.mjs) for the corresponding example. See the [actual-a-equal-4.json](actual-a-equal-4.json) and [expected-a-equal-4.json](expected-a-equal-4.json) files. The second is a subset of the first.


```js
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
```

Example of execution:

```js
➜  ast-compare node compare-ast.mjs 4
comparison result = The given piece [
    {
        "type": "ExpressionStatement",
        "expression": {
            "type": "AssignmentExpression",
            "operator": "=",
            "left": {
                "type": "Identifier"
            },
            "right": {
                "type": "Literal"
            }
        }
    }
] 
```
```
and 
```
```js
[
    {
        "type": "ExpressionStatement",
        "expression": {
            "type": "AssignmentExpression",
            "operator": "4",
            "left": {
                "type": "Identifier",
                "name": "a"
            },
            "right": {
                "type": "Literal",
                "value": 4
            }
        }
    }
```
```
] don't match.
```

## Simple Example


See file [hello-ast-compare.mjs](hello-ast-compare.mjs) for a variant of this example.

```js
import { strict as assert } from "assert";

import { compare } from "ast-compare";

// Find out, does an object/array/string/nested-mix is a subset or equal to another input:
assert.equal(
  compare(
    {
      a: {
        b: "d",
        c: [],
        e: "f",
        g: "h",
      },
    },
    {
      a: {
        b: "d",
        c: [],
      },
    },
  ),
  true,
);
```

## Documentation

Please [visit codsen.com](https://codsen.com/os/ast-compare/) for a full description of the API.

See https://codsen.com/os/ast-compare/ for examples.

I have made a fork at https://github.com/ULL-ESIT-PL/codsen

