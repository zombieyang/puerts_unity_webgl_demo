using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using Puerts;
using System;
using System.IO;
using System.Collections.Generic;

/**
 * 仿照webgl-jsbuild包所写的js处理器
 * 对应ts-loader的使用逻辑
*/
public class WebGLPuertsPostProcessor {

    private static void run(string runEntry, string lastBuiltPath) 
    {
        string PuertsWebglJSRoot = Application.dataPath + "/../Puer-Project/";
        if (lastBuiltPath != null) {
            UnityEngine.Debug.Log("上一次构建路径：" + lastBuiltPath);

        } else {
            lastBuiltPath = PuertsWebglJSRoot + "dist/";
            UnityEngine.Debug.Log("上一次构建路径为空，生成至：" + lastBuiltPath);
        }


        JsEnv jsenv = new JsEnv();

        jsenv.UsingAction<string>();
        jsenv.UsingAction<string, string>();

        jsenv.Eval<Action<string>>(@"(function (requirePath) { 
            global.REQUIRE_PATH = requirePath;
            global.require = require('node:module').createRequire(requirePath)
        })")(PuertsWebglJSRoot);
        
        Action<string, string> cpRuntimeJS = jsenv.Eval<Action<string, string>>(@"
            (function(puerRuntimeFilePath, targetPath) {
                const { cp, mkdir } = require('@puerts/shell-util');
                mkdir('-p', targetPath)
                cp(puerRuntimeFilePath, targetPath);
            });
        ");

        ILoader loader = new Puerts.TSLoader();
        Func<string, JSObject> getAllTSSpecifier = jsenv.Eval<Func<string, JSObject>>(@"
            (function(tsRootPath) {
                const glob = require('glob');
                const path = require('node:path');
                tsRootPath = path.normalize(tsRootPath).replace(/\\/g, '/')
                const ret = glob
                    .sync(tsRootPath + '/**/*.ts', {ignore: tsRootPath + '/node_modules/**/*'})
                    .map(fullpath => {
                        return fullpath.substring(tsRootPath.length + 1, fullpath.length);
                    })
                    .filter(p=> p);

                ret.push('puerts/init.mjs')
                ret.push('puerts/log.mjs')
                ret.push('puerts/csharp.mjs')
                ret.push('puerts/events.mjs')
                ret.push('puerts/timer.mjs')
                ret.push('puerts/promises.mjs')
                ret.push('puerts/dispose.mjs')
                ret.push('puerts/polyfill.mjs')
                ret.push('puerts/nodepatch.mjs')
                ret.push('puerts/cjsload.mjs')
                ret.push('puerts/modular.mjs')
                return ret;
            })
        ");
        JSObject tsfiles = getAllTSSpecifier(Application.dataPath + "/../Puer-Project");

        Action<string, JSObject, ILoader> globjs = jsenv.Eval<Action<string, JSObject, ILoader>>(@"
            (function(targetPath, specifiers, loader) {
                const fs = require('node:fs');
                const path = require('node:path');
                const { mkdir } = require('@puerts/shell-util');
                const babel = require('@babel/core');

                const contents = specifiers.reduce((ret, s)=> {
                    ret[s] = loader.ReadFile(s, {});
                    return ret;
                }, {})

                function buildForMinigame() {
                    Object.keys(contents).forEach(s=> {
                        const resourceFilePath = path.join(targetPath, 'puerts_minigame_js_resources', s);
                        mkdir('-p', path.dirname(resourceFilePath));
                        fs.writeFileSync(
                            resourceFilePath
                                .replace('.mjs', '.js')
                                .replace('.cjs', '.js')
                                .replace('.mts', '.js')
                                .replace('.ts', '.js'),

                            contents[s]
                        );
                    })
                }
                function buildForBrowser() {
                    const resourcePath = path.join(targetPath, 'puerts_browser_js_resources.js');
                    mkdir('-p', path.dirname(resourcePath));

                    fs.writeFileSync(resourcePath, `
                        window.PUERTS_JS_RESOURCES = {
                            ${Object.keys(contents).map(s => {
                                return `'${s}': (function(exports, require, module, __filename, __dirname) {
                                    ${babel.transformSync(contents[s], {
                                        cwd: REQUIRE_PATH,
                                        'presets': [
                                            ['@babel/preset-env', { targets: { chrome: '94', esmodules: false } }]
                                        ]
                                    }).code}
                                })`
                            }).join(',')}
                        };
                    `);
                }

                " + runEntry + @"()
            });
        ");
        
        try {
            cpRuntimeJS(Path.GetFullPath("Packages/com.tencent.puerts.webgl/Javascripts~/PuertsDLLMock/dist/puerts-runtime.js"), lastBuiltPath);
            globjs(lastBuiltPath, tsfiles, loader);
        } 
        catch(Exception e) 
        {
            UnityEngine.Debug.LogError(e);
        }
        jsenv.Dispose();
    }

    [MenuItem("puerts-webgl/build puerts-js for minigame", false, 11)]
    static void minigame() 
    {
        run("buildForMinigame", GetLastBuildPath() != null ? GetLastBuildPath() + "/../minigame" : null);
    }

    [MenuItem("puerts-webgl/build puerts-js for browser", false, 11)]
    static void browser() 
    {
        run("buildForBrowser", GetLastBuildPath());
    } 

    [MenuItem("puerts-webgl/install", false, 0)]
    static void npmInstall() 
    {
        JsEnv jsenv = new Puerts.JsEnv();
        jsenv.UsingAction<string>();
        Action<string> npmInstaller = jsenv.Eval<Action<string>>(@"
            (function(cwd) {
                require('child_process').execSync('npm i', { cwd })
            });
        ");
        npmInstaller(Path.GetFullPath("Packages/com.tencent.puerts.webgl.jsbuild/Javascripts~"));
    }



    [MenuItem("puerts-webgl/build puerts-js for minigame", true)]
    [MenuItem("puerts-webgl/build puerts-js for browser", true)]
    static bool NodeModulesInstalled() 
    {
        return Directory.Exists(Application.dataPath + "/../Puer-Project/node_modules");
    }
    [MenuItem("puerts-webgl/install", true)]
    static bool NodeModulesNotInstalled() 
    {
        return !NodeModulesInstalled();
    }


    
    protected static string GetLastBuildPath() {
        return EditorPrefs.GetString("PUER_WEBGL_LAST_BUILDPATH");
    }

    [PostProcessBuildAttribute(1)]
    public static void OnPostprocessBuild(BuildTarget target, string pathToBuiltProject) 
    {
        if (target == BuildTarget.WebGL) 
        {
            EditorPrefs.SetString("PUER_WEBGL_LAST_BUILDPATH", pathToBuiltProject);
            UnityEngine.Debug.Log("构建成功，请用puerts-webgl/build js构建js资源");
        }
    }
}