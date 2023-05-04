/// <reference types="node" />
import { EventEmitter } from 'events';
import { ChildProcess, SpawnOptions } from 'child_process';
import { Readable, Transform, TransformCallback, Writable } from 'stream';
export interface Options extends SpawnOptions {
    /**
     * if binary is enabled message and stderr events will not be emitted
     */
    mode?: 'text' | 'json' | 'binary';
    formatter?: string | ((param: string) => any);
    parser?: string | ((param: string) => any);
    stderrParser?: string | ((param: string) => any);
    encoding?: BufferEncoding;
    pythonPath?: string;
    /**
     * see https://docs.python.org/3.7/using/cmdline.html
     */
    pythonOptions?: string[];
    /**
     * overrides scriptPath passed into PythonShell constructor
     */
    scriptPath?: string;
    /**
     * arguments to your program
     */
    args?: string[];
}
export declare class PythonShellError extends Error {
    traceback: string | Buffer;
    exitCode?: number;
}
export declare class PythonShellErrorWithLogs extends PythonShellError {
    logs: any[];
}
/**
 * Takes in a string stream and emits batches seperated by newlines
 */
export declare class NewlineTransformer extends Transform {
    private _lastLineData;
    _transform(chunk: any, encoding: string, callback: TransformCallback): void;
    _flush(done: TransformCallback): void;
}
/**
 * An interactive Python shell exchanging data through stdio
 * @param {string} script    The python script to execute
 * @param {object} [options] The launch options (also passed to child_process.spawn)
 * @param [stdoutSplitter] Optional. Splits stdout into chunks, defaulting to splitting into newline-seperated lines
 * @param [stderrSplitter] Optional. splits stderr into chunks, defaulting to splitting into newline-seperated lines
 * @constructor
 */
export declare class PythonShell extends EventEmitter {
    scriptPath: string;
    command: string[];
    mode: string;
    formatter: (param: string | Object) => any;
    parser: (param: string) => any;
    stderrParser: (param: string) => any;
    terminated: boolean;
    childProcess: ChildProcess;
    stdin: Writable;
    stdout: Readable;
    stderr: Readable;
    exitSignal: string;
    exitCode: number;
    private stderrHasEnded;
    private stdoutHasEnded;
    private _remaining;
    private _endCallback;
    static defaultPythonPath: string;
    static defaultOptions: Options;
    /**
     * spawns a python process
     * @param scriptPath path to script. Relative to current directory or options.scriptFolder if specified
     * @param options
     * @param stdoutSplitter Optional. Splits stdout into chunks, defaulting to splitting into newline-seperated lines
     * @param stderrSplitter Optional. splits stderr into chunks, defaulting to splitting into newline-seperated lines
     */
    constructor(scriptPath: string, options?: Options, stdoutSplitter?: Transform, stderrSplitter?: Transform);
    static format: {
        text: (data: any) => string;
        json: (data: any) => string;
    };
    static parse: {
        text: (data: any) => string;
        json: (data: string) => any;
    };
    /**
     * checks syntax without executing code
     * @returns rejects promise w/ string error output if syntax failure
     */
    static checkSyntax(code: string): Promise<{
        stdout: string;
        stderr: string;
    }>;
    static getPythonPath(): string;
    /**
     * checks syntax without executing code
     * @returns {Promise} rejects w/ stderr if syntax failure
     */
    static checkSyntaxFile(filePath: string): Promise<{
        stdout: string;
        stderr: string;
    }>;
    /**
     * Runs a Python script and returns collected messages as a promise.
     * If the promise is rejected, the err will probably be of type PythonShellErrorWithLogs
     * @param scriptPath   The path to the script to execute
     * @param options  The execution options
     */
    static run(scriptPath: string, options?: Options): Promise<any[]>;
    /**
     * Runs the inputted string of python code and returns collected messages as a promise. DO NOT ALLOW UNTRUSTED USER INPUT HERE!
     * @param code   The python code to execute
     * @param options  The execution options
     * @return a promise with the output from the python script
     */
    static runString(code: string, options?: Options): Promise<any[]>;
    static getVersion(pythonPath?: string): import("child_process").PromiseWithChild<{
        stdout: string;
        stderr: string;
    }>;
    static getVersionSync(pythonPath?: string): string;
    /**
     * Parses an error thrown from the Python process through stderr
     * @param  {string|Buffer} data The stderr contents to parse
     * @return {Error} The parsed error with extended stack trace when traceback is available
     */
    private parseError;
    /**
     * Sends a message to the Python shell through stdin
     * Override this method to format data to be sent to the Python process
     * @returns {PythonShell} The same instance for chaining calls
     */
    send(message: string | Object): this;
    /**
     * Closes the stdin stream. Unless python is listening for stdin in a loop
     * this should cause the process to finish its work and close.
     * @returns {PythonShell} The same instance for chaining calls
     */
    end(callback: (err: PythonShellError, exitCode: number, exitSignal: string) => any): this;
    /**
     * Sends a kill signal to the process
     * @returns {PythonShell} The same instance for chaining calls
     */
    kill(signal?: NodeJS.Signals): this;
    /**
     * Alias for kill.
     * @deprecated
     */
    terminate(signal?: NodeJS.Signals): this;
}
export interface PythonShell {
    addListener(event: string, listener: (...args: any[]) => void): this;
    emit(event: string | symbol, ...args: any[]): boolean;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    prependListener(event: string, listener: (...args: any[]) => void): this;
    prependOnceListener(event: string, listener: (...args: any[]) => void): this;
    addListener(event: "message", listener: (parsedChunk: any) => void): this;
    emit(event: "message", parsedChunk: any): boolean;
    on(event: "message", listener: (parsedChunk: any) => void): this;
    once(event: "message", listener: (parsedChunk: any) => void): this;
    prependListener(event: "message", listener: (parsedChunk: any) => void): this;
    prependOnceListener(event: "message", listener: (parsedChunk: any) => void): this;
    addListener(event: "stderr", listener: (parsedChunk: any) => void): this;
    emit(event: "stderr", parsedChunk: any): boolean;
    on(event: "stderr", listener: (parsedChunk: any) => void): this;
    once(event: "stderr", listener: (parsedChunk: any) => void): this;
    prependListener(event: "stderr", listener: (parsedChunk: any) => void): this;
    prependOnceListener(event: "stderr", listener: (parsedChunk: any) => void): this;
    addListener(event: "close", listener: () => void): this;
    emit(event: "close"): boolean;
    on(event: "close", listener: () => void): this;
    once(event: "close", listener: () => void): this;
    prependListener(event: "close", listener: () => void): this;
    prependOnceListener(event: "close", listener: () => void): this;
    addListener(event: "error", listener: (error: NodeJS.ErrnoException) => void): this;
    emit(event: "error", error: NodeJS.ErrnoException): boolean;
    on(event: "error", listener: (error: NodeJS.ErrnoException) => void): this;
    once(event: "error", listener: (error: NodeJS.ErrnoException) => void): this;
    prependListener(event: "error", listener: (error: NodeJS.ErrnoException) => void): this;
    prependOnceListener(event: "error", listener: (error: NodeJS.ErrnoException) => void): this;
    addListener(event: "pythonError", listener: (error: PythonShellError) => void): this;
    emit(event: "pythonError", error: PythonShellError): boolean;
    on(event: "pythonError", listener: (error: PythonShellError) => void): this;
    once(event: "pythonError", listener: (error: PythonShellError) => void): this;
    prependListener(event: "pythonError", listener: (error: PythonShellError) => void): this;
    prependOnceListener(event: "pythonError", listener: (error: PythonShellError) => void): this;
}
