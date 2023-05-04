"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonShell = exports.NewlineTransformer = exports.PythonShellErrorWithLogs = exports.PythonShellError = void 0;
const events_1 = require("events");
const child_process_1 = require("child_process");
const os_1 = require("os");
const path_1 = require("path");
const stream_1 = require("stream");
const fs_1 = require("fs");
const util_1 = require("util");
function toArray(source) {
    if (typeof source === 'undefined' || source === null) {
        return [];
    }
    else if (!Array.isArray(source)) {
        return [source];
    }
    return source;
}
/**
 * adds arguments as properties to obj
 */
function extend(obj, ...args) {
    Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        if (source) {
            for (let key in source) {
                obj[key] = source[key];
            }
        }
    });
    return obj;
}
/**
 * gets a random int from 0-10000000000
 */
function getRandomInt() {
    return Math.floor(Math.random() * 10000000000);
}
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class PythonShellError extends Error {
}
exports.PythonShellError = PythonShellError;
class PythonShellErrorWithLogs extends PythonShellError {
}
exports.PythonShellErrorWithLogs = PythonShellErrorWithLogs;
/**
 * Takes in a string stream and emits batches seperated by newlines
 */
class NewlineTransformer extends stream_1.Transform {
    _transform(chunk, encoding, callback) {
        let data = chunk.toString();
        if (this._lastLineData)
            data = this._lastLineData + data;
        const lines = data.split(os_1.EOL);
        this._lastLineData = lines.pop();
        //@ts-ignore this works, node ignores the encoding if it's a number
        lines.forEach(this.push.bind(this));
        callback();
    }
    _flush(done) {
        if (this._lastLineData)
            this.push(this._lastLineData);
        this._lastLineData = null;
        done();
    }
}
exports.NewlineTransformer = NewlineTransformer;
/**
 * An interactive Python shell exchanging data through stdio
 * @param {string} script    The python script to execute
 * @param {object} [options] The launch options (also passed to child_process.spawn)
 * @param [stdoutSplitter] Optional. Splits stdout into chunks, defaulting to splitting into newline-seperated lines
 * @param [stderrSplitter] Optional. splits stderr into chunks, defaulting to splitting into newline-seperated lines
 * @constructor
 */
class PythonShell extends events_1.EventEmitter {
    /**
     * spawns a python process
     * @param scriptPath path to script. Relative to current directory or options.scriptFolder if specified
     * @param options
     * @param stdoutSplitter Optional. Splits stdout into chunks, defaulting to splitting into newline-seperated lines
     * @param stderrSplitter Optional. splits stderr into chunks, defaulting to splitting into newline-seperated lines
     */
    constructor(scriptPath, options, stdoutSplitter = null, stderrSplitter = null) {
        super();
        /**
         * returns either pythonshell func (if val string) or custom func (if val Function)
         */
        function resolve(type, val) {
            if (typeof val === 'string') {
                // use a built-in function using its name
                return PythonShell[type][val];
            }
            else if (typeof val === 'function') {
                // use a custom function
                return val;
            }
        }
        if (scriptPath.trim().length == 0)
            throw Error("scriptPath cannot be empty! You must give a script for python to run");
        let self = this;
        let errorData = '';
        events_1.EventEmitter.call(this);
        options = extend({}, PythonShell.defaultOptions, options);
        let pythonPath;
        if (!options.pythonPath) {
            pythonPath = PythonShell.defaultPythonPath;
        }
        else
            pythonPath = options.pythonPath;
        let pythonOptions = toArray(options.pythonOptions);
        let scriptArgs = toArray(options.args);
        this.scriptPath = (0, path_1.join)(options.scriptPath || '', scriptPath);
        this.command = pythonOptions.concat(this.scriptPath, scriptArgs);
        this.mode = options.mode || 'text';
        this.formatter = resolve('format', options.formatter || this.mode);
        this.parser = resolve('parse', options.parser || this.mode);
        // We don't expect users to ever format stderr as JSON so we default to text mode
        this.stderrParser = resolve('parse', options.stderrParser || 'text');
        this.terminated = false;
        this.childProcess = (0, child_process_1.spawn)(pythonPath, this.command, options);
        ['stdout', 'stdin', 'stderr'].forEach(function (name) {
            self[name] = self.childProcess[name];
            self.parser && self[name] && self[name].setEncoding(options.encoding || 'utf8');
        });
        // Node buffers stdout&stderr in batches regardless of newline placement
        // This is troublesome if you want to recieve distinct individual messages
        // for example JSON parsing breaks if it recieves partial JSON
        // so we use newlineTransformer to emit each batch seperated by newline
        if (this.parser && this.stdout) {
            if (!stdoutSplitter)
                stdoutSplitter = new NewlineTransformer();
            // note that setting the encoding turns the chunk into a string
            stdoutSplitter.setEncoding(options.encoding || 'utf8');
            this.stdout.pipe(stdoutSplitter).on('data', (chunk) => {
                this.emit('message', self.parser(chunk));
            });
        }
        // listen to stderr and emit errors for incoming data
        if (this.stderrParser && this.stderr) {
            if (!stderrSplitter)
                stderrSplitter = new NewlineTransformer();
            // note that setting the encoding turns the chunk into a string
            stderrSplitter.setEncoding(options.encoding || 'utf8');
            this.stderr.pipe(stderrSplitter).on('data', (chunk) => {
                this.emit('stderr', self.stderrParser(chunk));
            });
        }
        if (this.stderr) {
            this.stderr.on('data', function (data) {
                errorData += '' + data;
            });
            this.stderr.on('end', function () {
                self.stderrHasEnded = true;
                terminateIfNeeded();
            });
        }
        else {
            self.stderrHasEnded = true;
        }
        if (this.stdout) {
            this.stdout.on('end', function () {
                self.stdoutHasEnded = true;
                terminateIfNeeded();
            });
        }
        else {
            self.stdoutHasEnded = true;
        }
        this.childProcess.on('error', function (err) {
            self.emit('error', err);
        });
        this.childProcess.on('exit', function (code, signal) {
            self.exitCode = code;
            self.exitSignal = signal;
            terminateIfNeeded();
        });
        function terminateIfNeeded() {
            if (!self.stderrHasEnded || !self.stdoutHasEnded || (self.exitCode == null && self.exitSignal == null))
                return;
            let err;
            if (self.exitCode && self.exitCode !== 0) {
                if (errorData) {
                    err = self.parseError(errorData);
                }
                else {
                    err = new PythonShellError('process exited with code ' + self.exitCode);
                }
                err = extend(err, {
                    executable: pythonPath,
                    options: pythonOptions.length ? pythonOptions : null,
                    script: self.scriptPath,
                    args: scriptArgs.length ? scriptArgs : null,
                    exitCode: self.exitCode
                });
                // do not emit error if only a callback is used
                if (self.listeners('pythonError').length || !self._endCallback) {
                    self.emit('pythonError', err);
                }
            }
            self.terminated = true;
            self.emit('close');
            self._endCallback && self._endCallback(err, self.exitCode, self.exitSignal);
        }
        ;
    }
    /**
     * checks syntax without executing code
     * @returns rejects promise w/ string error output if syntax failure
     */
    static checkSyntax(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomInt = getRandomInt();
            const filePath = (0, os_1.tmpdir)() + path_1.sep + `pythonShellSyntaxCheck${randomInt}.py`;
            const writeFilePromise = (0, util_1.promisify)(fs_1.writeFile);
            return writeFilePromise(filePath, code).then(() => {
                return this.checkSyntaxFile(filePath);
            });
        });
    }
    static getPythonPath() {
        return this.defaultOptions.pythonPath ? this.defaultOptions.pythonPath : this.defaultPythonPath;
    }
    /**
     * checks syntax without executing code
     * @returns {Promise} rejects w/ stderr if syntax failure
     */
    static checkSyntaxFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const pythonPath = this.getPythonPath();
            let compileCommand = `${pythonPath} -m py_compile ${filePath}`;
            return execPromise(compileCommand);
        });
    }
    /**
     * Runs a Python script and returns collected messages as a promise.
     * If the promise is rejected, the err will probably be of type PythonShellErrorWithLogs
     * @param scriptPath   The path to the script to execute
     * @param options  The execution options
     */
    static run(scriptPath, options) {
        return new Promise((resolve, reject) => {
            let pyshell = new PythonShell(scriptPath, options);
            let output = [];
            pyshell.on('message', function (message) {
                output.push(message);
            }).end(function (err) {
                if (err) {
                    err.logs = output;
                    reject(err);
                }
                else
                    resolve(output);
            });
        });
    }
    ;
    /**
     * Runs the inputted string of python code and returns collected messages as a promise. DO NOT ALLOW UNTRUSTED USER INPUT HERE!
     * @param code   The python code to execute
     * @param options  The execution options
     * @return a promise with the output from the python script
     */
    static runString(code, options) {
        // put code in temp file
        const randomInt = getRandomInt();
        const filePath = os_1.tmpdir + path_1.sep + `pythonShellFile${randomInt}.py`;
        (0, fs_1.writeFileSync)(filePath, code);
        return PythonShell.run(filePath, options);
    }
    ;
    static getVersion(pythonPath) {
        if (!pythonPath)
            pythonPath = this.getPythonPath();
        return execPromise(pythonPath + " --version");
    }
    static getVersionSync(pythonPath) {
        if (!pythonPath)
            pythonPath = this.getPythonPath();
        return (0, child_process_1.execSync)(pythonPath + " --version").toString();
    }
    /**
     * Parses an error thrown from the Python process through stderr
     * @param  {string|Buffer} data The stderr contents to parse
     * @return {Error} The parsed error with extended stack trace when traceback is available
     */
    parseError(data) {
        let text = '' + data;
        let error;
        if (/^Traceback/.test(text)) {
            // traceback data is available
            let lines = text.trim().split(os_1.EOL);
            let exception = lines.pop();
            error = new PythonShellError(exception);
            error.traceback = data;
            // extend stack trace
            error.stack += os_1.EOL + '    ----- Python Traceback -----' + os_1.EOL + '  ';
            error.stack += lines.slice(1).join(os_1.EOL + '  ');
        }
        else {
            // otherwise, create a simpler error with stderr contents
            error = new PythonShellError(text);
        }
        return error;
    }
    ;
    /**
     * Sends a message to the Python shell through stdin
     * Override this method to format data to be sent to the Python process
     * @returns {PythonShell} The same instance for chaining calls
     */
    send(message) {
        if (!this.stdin)
            throw new Error("stdin not open for writing");
        let data = this.formatter ? this.formatter(message) : message;
        if (this.mode !== 'binary')
            data += os_1.EOL;
        this.stdin.write(data);
        return this;
    }
    ;
    /**
     * Closes the stdin stream. Unless python is listening for stdin in a loop
     * this should cause the process to finish its work and close.
     * @returns {PythonShell} The same instance for chaining calls
     */
    end(callback) {
        if (this.childProcess.stdin) {
            this.childProcess.stdin.end();
        }
        this._endCallback = callback;
        return this;
    }
    ;
    /**
     * Sends a kill signal to the process
     * @returns {PythonShell} The same instance for chaining calls
     */
    kill(signal) {
        this.terminated = this.childProcess.kill(signal);
        return this;
    }
    ;
    /**
     * Alias for kill.
     * @deprecated
     */
    terminate(signal) {
        // todo: remove this next breaking release
        return this.kill(signal);
    }
}
exports.PythonShell = PythonShell;
// starting 2020 python2 is deprecated so we choose 3 as default
PythonShell.defaultPythonPath = process.platform != "win32" ? "python3" : "python";
PythonShell.defaultOptions = {}; //allow global overrides for options
// built-in formatters
PythonShell.format = {
    text: function toText(data) {
        if (!data)
            return '';
        else if (typeof data !== 'string')
            return data.toString();
        return data;
    },
    json: function toJson(data) {
        return JSON.stringify(data);
    }
};
//built-in parsers
PythonShell.parse = {
    text: function asText(data) {
        return data;
    },
    json: function asJson(data) {
        return JSON.parse(data);
    }
};
;
//# sourceMappingURL=index.js.map