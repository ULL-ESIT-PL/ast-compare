# AST comparison

You can compare ASTs in different ways: 

- Use an ordinary `diff` tool to compare JSON files.
  
  ```diff
  ➜  ast-compare git:(main) diff actual-a-equal-4.json expected-a-equal-4.json 
    10,11c10
    <             "type": "Identifier",
    <             "name": "a"
    ---
    >             "type": "Identifier"
    14,15c13
    <             "type": "Literal",
    <             "value": 4
    ---
    >             "type": "Literal"
    ```
- Use VSCode "select to compare" feature to compare the JSON files. Likely one of the best.
  
  ![images/vscode.png](images/vscode.png)
- Use the `check` method of ast-type nodes to check consistency of the AST.
- Another way to compare JSON files is to use the website https://www.jsondiff.com/.
- Use the npm package `json-diff` to compare JSON files.
- Use the npm package `ast-compare` to compare ASTs. 
  

## json-diff

### Installation of json-diff

```bash
npm i json-diff
```
![Screenshot](https://github.com/andreyvit/json-diff/raw/master/doc/screenshot.png)

Help:

```sh
➜  ast-compare git:(main) ✗ npx json-diff --help
Usage: json-diff [-vCjfoxnskKp] first.json second.json

Arguments:
  <first.json>          Old file
  <second.json>         New file

General options:
  -v, --verbose         Output progress info
  -C, --[no-]color      Colored output
  -j, --raw-json        Display raw JSON encoding of the diff
  -f, --full            Include the equal sections of the document, not just the deltas
      --max-elisions COUNT  Max number of ...'s to show in a row in "deltas" mode (before
                            collapsing them)

  -o, --output-keys KEYS  Always print this comma separated keys, with their value, if they are
                          part of an object with any diff

  -x, --exclude-keys KEYS  Exclude these comma separated keys from comparison on both files
  -n, --output-new-only   Output only the updated and new key/value pairs (without marking them as
                          such). If you need only the diffs from the old file, just exchange the
                          first and second json.

  -s, --sort            Sort primitive values in arrays before comparing
  -k, --keys-only       Compare only the keys, ignore the differences in values
  -K, --keep-unchanged-values   Instead of omitting values that are equal, output them as they are
  -p, --precision DECIMALS  Round all floating point numbers to this number of decimal places prior
                            to comparison

  -h, --help            Display this usage information
```

In javascript (ES5):

```js
var jsonDiff = require('json-diff');

console.log(jsonDiff.diffString({ foo: 'bar' }, { foo: 'baz' }));
// Output:
//  {
// -  foo: "bar"
// +  foo: "baz"
//  }

// As above, but without console colors
console.log(jsonDiff.diffString({ foo: 'bar' }, { foo: 'baz' }, { color: false }));

// Raw output:
console.log(jsonDiff.diff({ foo: 'bar', b: 3 }, { foo: 'baz', b: 3 }));
// Output:
// { foo: { __old: 'bar', __new: 'baz' } }

// Passing in the "full" option:
console.log(jsonDiff.diff({ foo: 'bar', b: 3 }, { foo: 'baz', b: 3 }, { full: true }));
// Output:
// { foo: { __old: 'bar', __new: 'baz' }, b: 3 }
```

In javascript (ES6+):

```js
import { diffString, diff } from 'json-diff';

console.log(diffString({ foo: 'bar' }, { foo: 'baz' }));
console.log(diff({ foo: 'bar' }, { foo: 'baz' }));
```


### ARRAYS

Unless two arrays are equal, all array elements are transformed into 2-tuple arrays:

- The first element is a one character string denoting the equality ('+', '-', '~', ' ')
- The second element is the old (-), new (+), altered sub-object (~), or unchanged (' ') value

```sh
    json-diff.js --full --raw-json <(echo '[1,7,3]') <(echo '[1,2,3]')
         [ [ " ", 1 ], [ "-", 7 ], [ "+", 2 ], [ " ", 3 ] ]
```

```sh
    json-diff.js --full --raw-json <(echo '[1,["a","b"],4]') <(echo '[1,["a","c"],4]')
         [ [ " ", 1 ], [ "~", [ [ " ", "a" ], [ "-", "b" ], [ "+", "c" ] ] ], [ " ", 4 ] ]
```

- If two arrays are equal, they are left as is.

### OBJECTS

**Object property values:**

- If equal, they are left as is
- Unequal scalar values are replaced by an object containing the old and new value:

```sh
    json-diff.js --full  --raw-json <(echo '{"a":4}') <(echo '{"a":5}')
        { "a": { "__old": 4, "__new": 5 } }
```

- Unequal arrays and objects are replaced by their diff:

```sh
    json-diff.js --full  --raw-json <(echo '{"a":[4,5]}') <(echo '{"a":[4,6]}')
        { "a": [ [ " ", 4 ], [ "-", 5 ], [ "+", 6 ] ] }
```

**Object property keys:**

- Object keys that are deleted or added between two objects are marked as such:

```sh
    json-diff.js --full  --raw-json <(echo '{"a":[4,5]}') <(echo '{"b":[4,5]}')
        { "a__deleted": [ 4, 5 ], "b__added": [ 4, 5 ] }
    json-diff.js --full  --raw-json <(echo '{"a":[4,5]}') <(echo '{"b":[4,6]}')
        { "a__deleted": [ 4, 5 ], "b__added": [ 4, 6 ] }
```

### Non-full mode

- In regular, delta-only (non-"full") mode, equal properties and values are omitted:

```sh
    json-diff.js --raw-json <(echo '{"a":4, "b":6}') <(echo '{"a":5,"b":6}')
        { "a": { "__old": 4, "__new": 5 } }
```

- Equal array elements are represented by a one-tuple containing only a space " ":

```sh
    json-diff.js --raw-json <(echo '[1,7,3]') <(echo '[1,2,3]')
        [ [ " " ], [ "-", 7 ], [ "+", 2 ], [ " " ] ]
```

## ast-compare

[ast-compare](https://codsen.com/os/ast-compare/) is an npm package can help when comparing Abstract Syntax Trees generated by parsers.

[ast-compare](https://codsen.com/os/ast-compare/)  is  [pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Version of this program, 2.1.0 (`npm i ast-compare@2.1.0`) uses CommonJSs.

[Visit codsen.com](https://codsen.com/os/ast-compare/) for a full description of the API.

See https://codsen.com/os/ast-compare/ for examples.

I have made a fork at https://github.com/ULL-ESIT-PL/codsen

### Installation of ast-compare

```bash
npm i ast-compare
```


See file [compare-ast.mjs](compare-ast.mjs) for the corresponding example. See the [actual-a-equal-4.json](actual-a-equal-4.json) and [expected-a-equal-4.json](expected-a-equal-4.json) files. The second is a subset of the first.


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

### Simple Example


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

