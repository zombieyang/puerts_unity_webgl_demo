using UnityEngine;
using System;
using System.Linq;
using System.Collections.Generic;
using System.IO;

namespace Puerts.TSLoader
{
    public class TSLoader : Puerts.ILoader, Puerts.IResolvableLoader, Puerts.IModuleChecker, IBuiltinLoadedListener
    {
        public static string TSLoaderPath = Path.GetFullPath("Packages/com.tencent.puerts.ts-loader");

        Puerts.DefaultLoader puerDefaultLoader = null;
        List<Puerts.ILoader> LoaderChain = new List<Puerts.ILoader>();

        public void OnBuiltinLoaded(JsEnv env)
        {
            foreach (var loader in LoaderChain)
            {
                try 
                {
                    if (loader is IBuiltinLoadedListener) (loader as IBuiltinLoadedListener).OnBuiltinLoaded(env);
                }
                catch(Exception e)
                {
                    UnityEngine.Debug.LogException(e);
                }
            }
        }

        public TSLoader(string externalTSConfigPath): this(new string[]{ externalTSConfigPath }) {}

        public TSLoader(string[] externalTSConfigPath = null)
        {
#if UNITY_EDITOR
            if (externalTSConfigPath != null)
            {   
                foreach(string path in externalTSConfigPath)
                {
                    TSDirectoryCollector.AddTSCompiler(path);
                }
            }
#endif
        }

        public void UseRuntimeLoader(Puerts.ILoader loader)
        {
            LoaderChain.Add(loader);
        }

        public bool IsESM(string path)
        {
            return !path.EndsWith(".cjs") && !path.EndsWith(".cts");
        }

        public string Resolve(string specifier, string referrer)
        {
            lastResolveSpecifier = null;
#if UNITY_EDITOR && !PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE
            string fullPath;
            if (PathHelper.IsRelative(specifier))
            {
                fullPath = TSDirectoryCollector.TryGetFullTSPath(
                    PathHelper.normalize(PathHelper.Dirname(referrer) + "/" + specifier)
                );
            }
            else
            {
                fullPath = TSDirectoryCollector.TryGetFullTSPath(specifier);
            }
            if (fullPath != null) return fullPath;
#else
            if (specifier.EndsWith(".ts") || specifier.EndsWith(".mts"))
            {
                specifier = specifier.Replace(".mts", ".mjs").Replace(".ts", ".js");
            }
#endif
            if (LoaderChain.Count == 0) 
            {
                // UnityEngine.Debug.Log(specifier + " use default loader");
                if (puerDefaultLoader == null) puerDefaultLoader = new Puerts.DefaultLoader();
                if (PathHelper.IsRelative(specifier))
                {
                    specifier = PathHelper.normalize(PathHelper.Dirname(referrer) + "/" + specifier);
                }
                return puerDefaultLoader.FileExists(specifier) ? specifier : null;
            }
            else 
            {
                foreach (var loader in LoaderChain)
                {
                    if (loader is IResolvableLoader)
                    {
                        var resolveResult = (loader as IResolvableLoader).Resolve(specifier, referrer);
                        lastResolveLoader = loader;
                        lastResolveSpecifier = resolveResult;
                        if (!String.IsNullOrEmpty(resolveResult)) {
                            return resolveResult;
                        }
                    } 
                    else 
                    {
                        if (PathHelper.IsRelative(specifier))
                        {
                            specifier = PathHelper.normalize(PathHelper.Dirname(referrer) + "/" + specifier);
                        }
                        if (loader.FileExists(specifier)) 
                        {
                            lastResolveLoader = loader;
                            lastResolveSpecifier = specifier;
                            return specifier;
                        }
                    }
                }
                return null;
            }
        }

        public bool FileExists(string filename)
        {
            return true;
        }
        string lastResolveSpecifier;
        Puerts.ILoader lastResolveLoader;
  
        public virtual string ReadFile(string specifier, out string debugpath)
        {
#if UNITY_EDITOR && !PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE
            string filepath = specifier;
            if (filepath.EndsWith(".ts") || filepath.EndsWith(".mts")) 
            {
                debugpath = filepath; 
                return TSDirectoryCollector.EmitTSFile(filepath); 
                
            } 
            else if (System.IO.File.Exists(filepath)) 
            {
                debugpath = filepath;
                return System.IO.File.ReadAllText(filepath);
                
            }
#else
            if (specifier.EndsWith(".ts") || specifier.EndsWith(".mts"))
            {
                specifier = specifier.Replace(".mts", ".mjs").Replace(".ts", ".js");
            }
#endif
            string content = null;
            debugpath = "";
            if (LoaderChain.Count == 0) 
            {
                content = puerDefaultLoader.ReadFile(specifier, out debugpath);
            }
            else 
            {
                if (lastResolveSpecifier == specifier) 
                {
                    content = lastResolveLoader.ReadFile(specifier, out debugpath);
                }
                else
                {
                    foreach (var loader in LoaderChain)
                    {
                        content = loader.ReadFile(specifier, out debugpath);
                    }
                }
            }

#if UNITY_EDITOR && !PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE
            // consider give a hook in puerts.core later.
            if (specifier.Contains("puerts/polyfill.mjs") || specifier.Contains("puerts/nodepatch.mjs")) content = @"
import '../console-track.mjs'
import '../puerts-source-map-support.mjs'
" 
                + content;
#endif
            return content;
        }
    }
}