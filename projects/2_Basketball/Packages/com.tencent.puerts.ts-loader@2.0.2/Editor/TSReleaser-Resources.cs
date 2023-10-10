using UnityEditor;
using System;
using System.Linq;
using System.IO;

namespace Puerts.TSLoader
{
    public class TSReleaser 
    {
        protected static JsEnv _env = null;
        protected static JsEnv env 
        {
            get 
            {
                if (_env == null) {
                    _env = new JsEnv();
                    _env.UsingAction<string>();
                    _env.UsingFunc<int, string>();
                    _env.UsingAction<string, string[], Func<int, string>>();
                    _env.Eval<Action<string>>(@"(function (requirePath) { 
                        global.require = require('node:module').createRequire(requirePath + '/')
                        if (!require('node:fs').existsSync(requirePath + '/node_modules')) {
                            throw new Error(`node_modules is not installed, please run 'npm install' in ${requirePath}`);
                        }
                    })")(Path.GetFullPath("Packages/com.tencent.puerts.ts-loader/Javascripts~"));
                } 
                return _env;
            }
        }

        protected static Action<string, string[], Func<int, string>> _TSCRunner;
        public static void ReleaseAllTS(string saveTo, Func<int, string> outputRelativeCallback = null) 
        {
            string[] allPaths = TSDirectoryCollector.GetAllDirectoryAbsPath();
            allPaths = allPaths.Where(path => !path.Contains("/Editor/")).ToArray();

            if (_TSCRunner == null) 
            {
                _TSCRunner = env.Eval<Action<string, string[], Func<int, string>>>(@" 
                    (function() { 
                        const releaseTS = require('./release').default;

                        return function(saveTo, tsConfigPathCSArr, relativePathCallback) {
                            const arr = [];
                            for (let i = 0; i < tsConfigPathCSArr.Length; i++) {
                                arr.push(tsConfigPathCSArr.get_Item(i));
                            }
                            return releaseTS(saveTo, arr, relativePathCallback ? (index) => relativePathCallback.Invoke(index) : null);
                        }
                    })()
                ");
            }
            _TSCRunner(saveTo, allPaths, outputRelativeCallback);
        }

        [MenuItem("PuerTS/TSLoader/Release TS To Resources")]
        public static void ReleaseToResources()
        {
            var saveTo = Configure.GetCodeOutputDirectory();
            ReleaseAllTS(saveTo + "/TSOutput/", (index) => index + "/Resources");

            UnityEngine.Debug.Log("Outputed Javascript to " + saveTo + "/TSOutput/");
        }
    }
}