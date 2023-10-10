#if UNITY_EDITOR
using System.IO;
using System;
using System.Linq;
using UnityEditor;
using System.Collections.Generic;

namespace Puerts.TSLoader
{
    public class TSDirectoryCollector
    {
        protected static Dictionary<string, TSCompiler> tsCompilers = new Dictionary<string, TSCompiler>();

        private class Utils {
            internal static string[] GetMaybeRealSpecifier(string specifier) 
            {
                if (specifier.EndsWith(".mjs")) 
                    return new string[] { 
                        specifier,
                        specifier.Substring(0, specifier.Length - 4) + ".mts"
                    };
                    
                else if (specifier.EndsWith(".cjs"))
                    return new string[] { 
                        specifier,
                        specifier.Substring(0, specifier.Length - 4) + ".cts"
                    };

                else if (specifier.EndsWith(".js"))
                    return new string[] { 
                        specifier, 
                        specifier.Substring(0, specifier.Length - 3) + ".ts"
                    };
                else 
                    return new string[] { 
                        specifier,
                        specifier + ".js",
                        specifier + ".ts",
                        specifier + "/index.js",
                        specifier + "/index.ts"
                    };
            }
        }

        private static bool _inited = false;
        public static void InitTSDirectoryCollector() 
        {
            if (_inited) return;
            var tsConfigList = AssetDatabase
                .FindAssets("tsconfig t:textAsset")
                .Select(guid => AssetDatabase.GUIDToAssetPath(guid))
                .Where(path=> path.Contains("/tsconfig.json"));
            foreach (var tsConfigPath in tsConfigList)
            {
                var absPath = Path.GetFullPath(tsConfigPath);
                AddTSCompiler(Path.GetDirectoryName(absPath));
            }
            _inited = true;
        }

        public static string[] GetAllDirectoryAbsPath()
        {
            InitTSDirectoryCollector();
            
            return tsCompilers.Keys.ToArray();
        }

        public static void AddTSCompiler(string absPath)
        {
            if (tsCompilers.ContainsKey(absPath)) return;
            tsCompilers[absPath] = new TSCompiler(absPath);
        }

        public static string TryGetFullTSPath(string originSpecifier) 
        {
            InitTSDirectoryCollector();

            string[] specifiers = Utils.GetMaybeRealSpecifier(originSpecifier);
            
            foreach (KeyValuePair<string, TSCompiler> item in tsCompilers)
            {
                foreach (string specifier in specifiers)
                {
                    string tryPath = Path.Combine(item.Key, specifier);
                    // UnityEngine.Debug.Log($"checking {item.Key} Contains {specifier}: {File.Exists(tryPath)}");
                    if (File.Exists(tryPath)) {
                        return tryPath;
                    }
                }
            }
            return null;
        }

        public static string EmitTSFile(string absPath) 
        {
            InitTSDirectoryCollector();

            foreach (KeyValuePair<string, TSCompiler> item in tsCompilers)
            {
                if (absPath.Contains(item.Key)) 
                {
                    return item.Value.EmitTSFile(absPath);
                } 
            }
            throw new Exception("emit tsfile " + absPath + " failed: not found");
        }

        public static string GetSourceMap(string absPath)
        {
            foreach (KeyValuePair<string, TSCompiler> item in tsCompilers)
            {
                if (absPath.Contains(item.Key)) 
                {
                    return item.Value.GetSourceMap(absPath);
                } 
            }
            throw new Exception("get source map " + absPath + " failed: not found");
        }

        public static string GetSpecifierByAssetPath(string assetPath) 
        {
            foreach (KeyValuePair<string, TSCompiler> item in tsCompilers)
            {
                if (assetPath.Contains(item.Key)) 
                { 
                    return Path_GetRelativePath_Shimming(item.Key, assetPath);
                }
            }
            return "";
        }
        
        public static TypescriptAsset GetAssetBySpecifier(string originSpecifier)
        {
            if (string.IsNullOrEmpty(originSpecifier)) return null;

            string[] specifiers = Utils.GetMaybeRealSpecifier(originSpecifier);

            foreach (KeyValuePair<string, TSCompiler> item in tsCompilers)
            {
                foreach (string specifier in specifiers)
                {
                    string tryPath = Path.Combine(item.Key, specifier);
                    if (File.Exists(tryPath)) {
                        return (TypescriptAsset)AssetDatabase
                            .LoadAssetAtPath(Path_GetRelativePath_Shimming(Path.Combine(UnityEngine.Application.dataPath, ".."), tryPath), typeof(TypescriptAsset));
                    }
                }
            }
            return null;
        }

        protected static string Path_GetRelativePath_Shimming(string relativeTo, string path)
        {
            var uri = new Uri(relativeTo);
            var rel = Uri.UnescapeDataString(uri.MakeRelativeUri(new Uri(path)).ToString()).Replace(Path.AltDirectorySeparatorChar, Path.DirectorySeparatorChar);
            if (rel.Contains(Path.DirectorySeparatorChar.ToString()) == false)
            {
                rel = $".{ Path.DirectorySeparatorChar }{ rel }";
            }
            return rel;
        }
    }
}
#endif