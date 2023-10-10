#if UNITY_EDITOR
using UnityEditor;
using UnityEngine;
using System;
using System.IO;
using System.Reflection;

namespace Puerts.TSLoader
{
    public class TypescriptAsset : ScriptableObject 
    {
        public string specifier 
        {
            get 
            {
                var specifier = TSDirectoryCollector.GetSpecifierByAssetPath(Path.GetFullPath(AssetDatabase.GetAssetPath(this)));
                if (specifier.EndsWith("ts")) specifier = specifier.Substring(0, specifier.Length - 2) + "js";
                return specifier;
            }
        }

        protected static string GetCurrentFolder()
        {
            Type projectWindowUtilType = typeof(ProjectWindowUtil);
            MethodInfo getActiveFolderPath = projectWindowUtilType.GetMethod("GetActiveFolderPath", BindingFlags.Static | BindingFlags.NonPublic);
            object obj = getActiveFolderPath.Invoke(null, new object[0]);
            string pathToCurrentFolder = obj.ToString();
            return pathToCurrentFolder;
        }
        
        [MenuItem("Assets/PuerTS/Create Typescript File(ESM)")]
        public static void CreateMTS()
        {
            System.IO.File.WriteAllText(
                System.IO.Path.Combine(Application.dataPath, "..", GetCurrentFolder(), "script.mts"),
                @"
console.log('hello world');
export default 'hello world'
                "
            );
            AssetDatabase.Refresh();
        }
        [MenuItem("Assets/PuerTS/Create tsconfig.json")]
        public static void CreateTSConfig()
        {
            System.IO.File.WriteAllText(
                System.IO.Path.Combine(Application.dataPath, "..", GetCurrentFolder(), "tsconfig.json"),
                @"
{
    ""compilerOptions"": { 
        ""target"": ""esnext"",
        ""jsx"": ""react"",
        ""inlineSourceMap"": true,
        ""moduleResolution"": ""node"",
        ""experimentalDecorators"": true,
        ""noImplicitAny"": true,
        ""typeRoots"": [
        ],

        ""module"": ""ES2015"",
        ""composite"": true,
        ""outDir"": ""./Resources""
    }
}"
            );
            AssetDatabase.Refresh();
        }
    }
}
#endif