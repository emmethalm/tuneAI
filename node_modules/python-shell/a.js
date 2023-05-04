"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const options = {
    scriptPath: 'C:\\dev\\python-shell',
    env: { PYTHONIOENCODING: 'utf8' },
};
const pyTeste = new index_1.PythonShell('a.py', options);
pyTeste
    .on('message', (line) => {
    console.log(line);
})
    .on('stderr', (std) => {
    console.log(std);
})
    .on('error', err => {
    console.log('err');
    console.log(err);
})
    .on('close', () => {
    console.log('Programa finalizado');
});
//# sourceMappingURL=a.js.map