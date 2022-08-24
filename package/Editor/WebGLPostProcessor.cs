using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using Puerts;
using System;
using System.IO;
using System.Collections.Generic;

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

        Puerts.Editor.NodeRunner runner = new Puerts.Editor.NodeRunner(PuertsWebglJSRoot);
            
        try {
            runner.Run(String.Format(@"
                await require('./node-scripts/build-dll.js')('{1}');
                require('./node-scripts/glob-js/index.js')('{0}', '{1}');
            ", runEntry, lastBuiltPath));
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
        string lastBuiltPath = EditorPrefs.GetString("puerts_webglLastBuiltPath");
        run("minigame", lastBuiltPath != null ? lastBuiltPath + "/../minigame" : null);
    }

    [MenuItem("puerts-webgl/build puerts-js for browser", false, 11)]
    static void browser() 
    {
        string lastBuiltPath = EditorPrefs.GetString("puerts_webglLastBuiltPath");
        run("browser", lastBuiltPath);
    }
    
    [PostProcessBuildAttribute(1)]
    public static void OnPostprocessBuild(BuildTarget target, string pathToBuiltProject) 
    {
        if (target == BuildTarget.WebGL) 
        {
            EditorPrefs.SetString("puerts_webglLastBuiltPath", pathToBuiltProject);
            UnityEngine.Debug.Log("构建成功，请用puerts-webgl/build js构建js资源");
        }
    }
}