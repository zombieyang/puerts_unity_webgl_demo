using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using Puerts;
using System;
using System.IO;

public class WebGLPuertsPostProcessor {



    private static void run(string runEntry, string lastBuiltPath) 
    {
        string PuertsWebglJSRoot = Path.GetFullPath("Packages/com.tencent.puerts.webgl/Javascripts~/");
        if (lastBuiltPath != null) {
            UnityEngine.Debug.Log("上一次构建路径：" + lastBuiltPath);

        } else {
            lastBuiltPath = PuertsWebglJSRoot + "dist/";
            UnityEngine.Debug.Log("上一次构建路径为空，生成至：" + lastBuiltPath);
        }
        JsEnv jsenv = new JsEnv();

        Action<string, string> postProcess = jsenv.Eval<Action<string, string>>(@"
            (function(rPath, targetPath) {
                const tscAndWebpack = require(rPath + 'build.js');
                const globAllJS = require(rPath + 'glob-js/index.js');

                tscAndWebpack(targetPath);
                globAllJS." + runEntry + @"(targetPath);
            });
        ");
        
        try {
            postProcess(PuertsWebglJSRoot, lastBuiltPath);
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
        run("buildForMinigame", _lastBuiltPath != null ? _lastBuiltPath + "/../minigame" : null);
    }

    [MenuItem("puerts-webgl/build puerts-js for browser", false, 11)]
    static void browser() 
    {
        run("buildForBrowser", _lastBuiltPath);
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
        npmInstaller(Path.GetFullPath("Packages/com.tencent.puerts.webgl/Javascripts~"));
    }



    [MenuItem("puerts-webgl/build puerts-js for minigame", true)]
    [MenuItem("puerts-webgl/build puerts-js for browser", true)]
    static bool NodeModulesInstalled() 
    {
        return Directory.Exists(Path.GetFullPath("Packages/com.tencent.puerts.webgl/Javascripts~/node_modules"));
    }
    [MenuItem("puerts-webgl/install", true)]
    static bool NodeModulesNotInstalled() 
    {
        return !NodeModulesInstalled();
    }


    
    protected static string _lastBuiltPath = null;
    [PostProcessBuildAttribute(1)]
    public static void OnPostprocessBuild(BuildTarget target, string pathToBuiltProject) 
    {
        if (target == BuildTarget.WebGL) 
        {
            _lastBuiltPath = pathToBuiltProject;
            UnityEngine.Debug.Log("构建成功，请用puerts-webgl/build js构建js资源");
        }
    }
}