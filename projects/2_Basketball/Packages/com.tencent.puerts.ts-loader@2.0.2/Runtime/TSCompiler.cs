#if UNITY_EDITOR
using System;
using System.IO;
using System.Collections.Generic;

namespace Puerts.TSLoader
{
    public class TSCompiler
    {
        Func<string, string> emitTSFile;
        Func<string, string> getSourceMap;
        public TSCompiler(string tsRootPath)
        {
            if (!Directory.Exists(TSLoader.TSLoaderPath)) 
            {
                throw new Exception("Please set TSLoader.TSLoaderPath as the installed path of puerts.ts-loader in your project");
            }
                
            var env = new JsEnv();
            env.UsingFunc<string, string>();
            env.UsingAction<string, string>();
            env.Eval<Action<string, string>>(@"(function (tsRootPath, requirePath) { 
                global.require = require('node:module').createRequire(requirePath + '/')
                if (!require('node:fs').existsSync(requirePath + '/node_modules')) {
                    throw new Error(`node_modules is not installed, please run 'npm install' in ${requirePath}`);
                }
                global.tsRootPath = tsRootPath
            })")(tsRootPath, TSLoader.TSLoaderPath + "/Javascripts~");

            emitTSFile = env.Eval<Func<string, string>>(@"
                (function() {
                    const Transpiler = require('./tsc').default;
                    const transpiler = new Transpiler(global.tsRootPath);

                    return function(tsFilePath) {
                        return transpiler.transpile(tsFilePath).content;
                    }
                })()
            ");

            getSourceMap = env.Eval<Func<string, string>>(@"
                (function() {
                    const Transpiler = require('./tsc').default;
                    const transpiler = new Transpiler(global.tsRootPath);

                    return function(tsFilePath) {
                        return transpiler.transpile(tsFilePath).sourceMap;
                    }
                })()
            ");
        }

        public string EmitTSFile(string tsPath) 
        {
            var ret = emitTSFile(tsPath);
            return ret;
        }

        public string GetSourceMap(string tsPath) 
        {
            var ret = getSourceMap(tsPath);
            return ret;
        }
    }
}
#endif