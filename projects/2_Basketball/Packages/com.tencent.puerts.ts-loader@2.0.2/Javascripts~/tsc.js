"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const glob_1 = require("glob");
const path_1 = require("path");
const typescript_1 = __importStar(require("typescript"));
const base_1 = __importDefault(require("./base"));
const DEFAULT_TS_CONFIG = {
    "target": typescript_1.default.ScriptTarget.ESNext,
    "module": typescript_1.default.ModuleKind.ES2015,
    "sourceMap": true,
    "inlineSourceMap": true,
    "noImplicitAny": true
};
class PuerTSCTranspiler extends base_1.default {
    constructor(tsRootPath) {
        super();
        let compilerOptions;
        const maybeTSConfigPath = (0, path_1.join)(tsRootPath, 'tsconfig.json');
        if (!(0, fs_1.existsSync)(maybeTSConfigPath)) {
            compilerOptions = DEFAULT_TS_CONFIG;
        }
        else {
            const cl = typescript_1.default.getParsedCommandLineOfConfigFile(maybeTSConfigPath, {}, Object.assign({ onUnRecoverableConfigFileDiagnostic: (d) => d }, typescript_1.default.sys));
            if (cl === null || cl === void 0 ? void 0 : cl.options) {
                compilerOptions = cl.options;
            }
            else {
                compilerOptions = DEFAULT_TS_CONFIG;
            }
        }
        compilerOptions.module = typescript_1.ModuleKind.ES2015;
        this.services = typescript_1.default.createLanguageService({
            getScriptFileNames: () => []
                .concat(glob_1.glob.sync((0, path_1.normalize)(tsRootPath + "/**/*.ts").replace(/\\/g, '/')))
                .concat(glob_1.glob.sync((0, path_1.normalize)(tsRootPath + "/**/*.mts").replace(/\\/g, '/'))),
            getCompilationSettings: () => compilerOptions,
            getScriptVersion: (path) => (0, fs_1.statSync)(path).mtimeMs.toString(),
            getScriptSnapshot: fileName => {
                if (!(0, fs_1.existsSync)(fileName)) {
                    return undefined;
                }
                return typescript_1.default.ScriptSnapshot.fromString((0, fs_1.readFileSync)(fileName).toString());
            },
            getCurrentDirectory: () => process.cwd(),
            getDefaultLibFileName: options => typescript_1.default.getDefaultLibFilePath(options),
            fileExists: typescript_1.default.sys.fileExists,
            readFile: typescript_1.default.sys.readFile,
            // getCustomTransformers: () => {
            //     return {
            //         before: [transformer]
            //     }
            // }
        }, typescript_1.default.createDocumentRegistry());
    }
    transpile(filepath) {
        filepath = process.platform == 'win32' ? (0, path_1.normalize)(filepath) : (0, path_1.normalize)(filepath);
        const emitOutput = this.services.getEmitOutput(filepath);
        const content = emitOutput.outputFiles.filter(file => file.name.endsWith('js'))[0];
        const sourceMap = emitOutput.outputFiles.filter(file => file.name.endsWith('map'))[0];
        return {
            content: content === null || content === void 0 ? void 0 : content.text,
            sourceMap: sourceMap === null || sourceMap === void 0 ? void 0 : sourceMap.text
        };
    }
}
exports.default = PuerTSCTranspiler;
