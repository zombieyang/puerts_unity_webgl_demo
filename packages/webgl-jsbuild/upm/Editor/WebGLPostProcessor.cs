using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using Puerts;
using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;

/**
 * ！！！！！！！！！！必读！！！！！！！
 * 由于本架构里，JS文件是运行在浏览器宿主JS引擎上的，因此，JS应当脱离Unity的资源系统进行加载（尤其是微信/字节小游戏里，必须这样做）
 * 所以，JsEnv.ExecuteModule执行JS时，并不会使用Loader进行JS加载。
 *
 * 那么JS是怎么执行的呢？
 * 答案在 Javascripts/PuertsDLLMock/index.ts的ExecuteModule函数中。
 * 在浏览器里，Puer会找全局变量PUERTS_JS_RESOURCES，它是一个key-value结构，记载着ExecuteModule会使用到的所有JS的内容。
 * 在微信小游戏里，则是直接将ExecuteModule接收到的JS名传递给微信的require，require会去找puerts_minigame_js_resources下的JS。
 *
 * 而浏览器上的PUERTS_JS_RESOURCES，以及微信小游戏的JS目录，就是靠本PostProcessor生成的
 * 本文件的作用就是收集Puerts.DefaultLoader用到的所有JS，并将它们构建为PUERTS_JS_RESOURCES和微信小游戏 puerts_minigame_js_resources 目录。
 * 
 * 如果你的游戏里使用了自定义的Loader，那么我建议您自己重新实现一个PostProcessor，以和你的Loader配套。
 */

public class WebGLPuertsPostProcessor
{

    public static List<string> fileGlobbers = new List<string>
    {
        Application.dataPath + "/**/Resources/**/*.mjs",
        Application.dataPath + "/**/Resources/**/*.cjs",
        Path.GetFullPath("Packages/com.tencent.puerts.core/") + "/**/Resources/**/*.mjs"
    };

    private static void RunBuild(string runEntry, string lastBuiltPath, CustomScriptData[] customScripts)
    {
        string PuertsWebglJSRoot = Path.GetFullPath("Packages/com.tencent.puerts.webgl.jsbuild/Javascripts~/");
        if (lastBuiltPath != null)
        {
            UnityEngine.Debug.Log("上一次构建路径：" + lastBuiltPath);

        }
        else
        {
            lastBuiltPath = PuertsWebglJSRoot + "dist/";
            UnityEngine.Debug.Log("上一次构建路径为空，生成至：" + lastBuiltPath);
        }


        JsEnv jsenv = new JsEnv();

        jsenv.UsingAction<string>();
        jsenv.UsingAction<string, string>();
        jsenv.UsingAction<string[], CustomScriptData[], string>();

        jsenv.Eval<Action<string>>(@"(function (requirePath) { 
            global.require = require('node:module').createRequire(requirePath)
        })")(PuertsWebglJSRoot);

        Action<string, string> cpRuntimeJS = jsenv.Eval<Action<string, string>>(@"
            (function(puerRuntimeFilePath, targetPath) {
                const { cp } = require('@puerts/shell-util');

                cp(puerRuntimeFilePath, targetPath);
            });
        ");

        Action<string[], CustomScriptData[], string> globjs = jsenv.Eval<Action<string[], CustomScriptData[], string>>(@"
            (function(csFileGlobbers, customScripts, targetPath) {
                function toJsArray(csArray) {
                    let results = [];
                    for (let i = 0; i < csArray.Length; i++) {
                        results.push(csArray.get_Item(i));
                    }
                    return results;
                }

                const globAllJS = require('.');

                globAllJS." + runEntry + @"(toJsArray(csFileGlobbers), customScripts ? toJsArray(customScripts) : null, targetPath);
                
            });
        ");

        try
        {
            cpRuntimeJS(Path.GetFullPath("Packages/com.tencent.puerts.webgl/Javascripts~/PuertsDLLMock/dist/puerts-runtime.js"), lastBuiltPath);
            globjs(fileGlobbers.ToArray(), customScripts, lastBuiltPath);
        }
        catch (Exception e)
        {
            jsenv.Dispose();
            throw;
        }
        jsenv.Dispose();
    }

    [MenuItem("puerts-webgl/build puerts-js for minigame", false, 11)]
    public static void BuildMinigame()
    {
        RunBuild("buildForMinigame", GetLastBuildPath() != null ? GetLastBuildPath() + "/../minigame" : null, null);
    }
    public static void BuildMinigame(string outputRootPath, string extensioName = null)
    {
        RunBuild("buildForMinigame", GetLastBuildPath() != null ? GetLastBuildPath() + "/../minigame" : null, GetCustomScripts(outputRootPath, extensioName));
    }
    public static void BuildMinigame(Dictionary<string, string> customScripts)
    {
        CustomScriptData[] _customScripts = customScripts != null ? customScripts.Keys
            .Select(resourceName => new CustomScriptData(resourceName, customScripts[resourceName]))
            .ToArray() : null;
        RunBuild("buildForMinigame", GetLastBuildPath() != null ? GetLastBuildPath() + "/../minigame" : null, _customScripts);
    }


    [MenuItem("puerts-webgl/build puerts-js for browser", false, 11)]
    public static void BuildBrowser()
    {
        RunBuild("buildForBrowser", GetLastBuildPath(), null);
    }
    public static void BuildBrowser(string outputRootPath, string extensioName = null)
    {
        RunBuild("buildForBrowser", GetLastBuildPath(), GetCustomScripts(outputRootPath, extensioName));
    }
    public static void BuildBrowser(Dictionary<string, string> scripts)
    {
        CustomScriptData[] _customScripts = scripts != null ? scripts.Keys
            .Select(resourceName => new CustomScriptData(resourceName, scripts[resourceName]))
            .ToArray() : null;
        RunBuild("buildForBrowser", GetLastBuildPath(), _customScripts);
    }



    [MenuItem("puerts-webgl/install", false, 0)]
    static void NodeModulesInstall()
    {
        JsEnv jsenv = new Puerts.JsEnv();
        jsenv.UsingAction<string>();
        try
        {
            Action<string> npmInstaller = jsenv.Eval<Action<string>>(@"
                (function(cwd) {
                    require('child_process').execSync('npm i', { cwd })
                });
            ");
            npmInstaller(Path.GetFullPath("Packages/com.tencent.puerts.webgl.jsbuild/Javascripts~"));
        }
        catch (Exception e)
        {
            UnityEngine.Debug.LogError("Npm install failed. you can cd into 'Packages/com.tencent.puerts.webgl.jsbuild/Javascripts~' to run 'npm install' by yourself");
        }
    }


    [MenuItem("PuerTS/WebGL/build puerts-js for minigame", true)]
    [MenuItem("PuerTS/WebGL/build puerts-js for browser", true)]
    static bool NodeModulesInstalled()
    {
        return Directory.Exists(Path.GetFullPath("Packages/com.tencent.puerts.webgl.jsbuild/Javascripts~/node_modules"));
    }
    [MenuItem("PuerTS/WebGL/install", true)]
    static bool NodeModulesInstallValidate()
    {
        return !NodeModulesInstalled();
    }


    protected static string GetLastBuildPath()
    {
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



    static CustomScriptData[] GetCustomScripts(string outputRootPath, string extensioName)
    {
        if (string.IsNullOrEmpty(outputRootPath) || !Directory.Exists(outputRootPath))
            return null;
        List<CustomScriptData> results = new List<CustomScriptData>();

        Func<string, bool> filter = (string file) =>
        {
            return file != null && (file.EndsWith(".js") || file.EndsWith(".cjs") || file.EndsWith(".mjs"));
        };

        outputRootPath = outputRootPath.Replace("\\", "/");
        if (!outputRootPath.EndsWith("/"))
        {
            outputRootPath += "/";
        }

        foreach (string file in ScanFiles(outputRootPath, filter))
        {
            string resourceName = file.Replace("\\", "/").Replace(outputRootPath, "");
            if (!string.IsNullOrEmpty(extensioName) && Path.GetExtension(resourceName) != extensioName)
            {
                resourceName = resourceName.Substring(0, resourceName.Length - Path.GetExtension(resourceName).Length) + extensioName;
            }
            results.Add(new CustomScriptData(
                resourceName,
                System.Text.Encoding.UTF8.GetString(File.ReadAllBytes(file))
            ));
        }
        return results.ToArray();
    }
    static List<string> ScanFiles(string dirPath, Func<string, bool> filter)
    {
        List<string> files = new List<string>();

        DirectoryInfo directoryInfo = new DirectoryInfo(dirPath);

        foreach (FileInfo fileInfo in directoryInfo.GetFiles())
        {
            if (filter != null && !filter(fileInfo.FullName))
                continue;
            files.Add(fileInfo.FullName);
        }
        foreach (DirectoryInfo dirInfo in directoryInfo.GetDirectories())
        {
            List<string> subFiles = ScanFiles(dirInfo.FullName, filter);
            if (subFiles != null) files.AddRange(subFiles);
        }

        return files;
    }

    class CustomScriptData
    {
        public string resourceName;
        public string code;
        public CustomScriptData(string resourceName, string code)
        {
            this.resourceName = resourceName;
            this.code = code;
        }
    }
}
