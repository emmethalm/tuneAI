"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const input = `print("aa\\n\\n\\nbb\\n\\ncc\\ndd")`;
const options = {};
_1.PythonShell.runString(input, options, function (err, results) {
    //console.warn(err)
    console.log(results);
});
//# sourceMappingURL=test.js.map