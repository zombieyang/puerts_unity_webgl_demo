using System;
using System.Diagnostics;
using System.IO;
using Puerts.TSLoader;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.Callbacks;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements;
using Debug = UnityEngine.Debug;

namespace Puerts
{
    namespace WebGL
    {
        [InitializeOnLoad]
        public class DevtoolWindow: EditorWindow
        {
            private static readonly string PreviewScenePath =
                "Packages/com.tencent.puerts.webgl.devtool/Scene/WebGLPreviewer.unity";
            
            private static JsEnv devtoolEnv;

            private static JsEnv getDevtoolEnv()
            {
                if (devtoolEnv == null)
                {   
                    var nodeModulesPath = Path.Combine(Path.GetFullPath("Packages/com.tencent.puerts.webgl.devtool"), "..");

                    var loader = new TSLoader.TSLoader(nodeModulesPath);
                    loader.UseRuntimeLoader(new NodeModuleLoader(nodeModulesPath));
                    loader.UseRuntimeLoader(new DefaultLoader());
                    
                    devtoolEnv = new JsEnv(loader);
                }
                
                int procId = 0;
                if (!IsPreviewServerAlive)
                {
                    LaunchPreviewServer();
                }
                
                EditorApplication.quitting += KillPreviewServer;

                return devtoolEnv;
            }

            [MenuItem("PuerTS/WebGL/Devtool Window")]
            public static void OpenDevtoolWindow() 
            {
                DevtoolWindow window = GetWindow<DevtoolWindow>();
                window.titleContent = new GUIContent("PuerTS WebGL devtool");
            }

            private static Process PreviewServerProc;

            private static bool IsPreviewServerAlive
            {
                get
                {
                    var res = PreviewServerProc != null && !PreviewServerProc.HasExited;
                    if (!res && EditorPrefs.GetInt("PUER_WEBGL_PREVIEW_PROCESS") == 0)
                    {
                        EditorPrefs.SetInt("PUER_WEBGL_PREVIEW_PROCESS", 0);
                    }

                    return res;
                }
            }
            
            private static void LaunchPreviewServer()
            {
                if (IsPreviewServerAlive) return;
                if (!Directory.Exists(Path.GetFullPath("puer-build")))
                    Directory.CreateDirectory(Path.GetFullPath("puer-build"));
                
                PreviewServerProc = Process.Start(new ProcessStartInfo()
                {
                    WorkingDirectory = Path.Combine(Path.GetFullPath("Packages/com.tencent.puerts.webgl.devtool"), ".."),
                    FileName = "npx",
                    Arguments = "serve -p 8080 " + Path.GetFullPath("puer-build"),
                    WindowStyle = ProcessWindowStyle.Hidden
                    
                });
                EditorPrefs.SetInt("PUER_WEBGL_PREVIEW_PROCESS", PreviewServerProc.Id);
                UnityEngine.Debug.Log("launch preview server success");
            }

            private static void KillPreviewServer()
            {
                if (IsPreviewServerAlive)
                {
                    string killCmd = "";
                    string killArgs = "";
                    if (Application.platform == RuntimePlatform.WindowsEditor)
                    {
                        killCmd = "taskkill";
                        killArgs = "/T /F /pid " + PreviewServerProc.Id;
                    }
                    else
                    {
                        killCmd = "kill";
                        killArgs = "" + PreviewServerProc.Id;
                    }

                    var killProc = Process.Start(new ProcessStartInfo
                    {
                        Arguments = killArgs,
                        FileName = killCmd,
                        WindowStyle = ProcessWindowStyle.Hidden,
                        CreateNoWindow = true
                    });
                    if (killProc != null) killProc.WaitForExit();
                    if (!IsPreviewServerAlive)
                    {
                        UnityEngine.Debug.LogError("kill the preview server success");
                    }
                    else
                    {
                        UnityEngine.Debug.LogError("kill the preview server failed");
                    }
                }
            }

            private static void SwitchServer()
            {
                if (IsPreviewServerAlive)
                {
                    KillPreviewServer();
                }
                else
                {
                    LaunchPreviewServer();
                }
            }

            private static VisualElement rootElement;
            public void OnEnable()
            {
                int procId = 0;
                if ((procId = EditorPrefs.GetInt("PUER_WEBGL_PREVIEW_PROCESS")) != 0)
                {
                    try
                    {
                        PreviewServerProc = Process.GetProcessById(procId);
                    }
                    catch (Exception e)
                    {
                        PreviewServerProc = null;
                    }
                    if (!IsPreviewServerAlive)
                        EditorPrefs.SetInt("PUER_WEBGL_PREVIEW_PROCESS", 0);
                }
                
                VisualTreeAsset uxmlAsset = AssetDatabase.LoadAssetAtPath<VisualTreeAsset>("Packages/com.tencent.puerts.webgl.devtool/Editor/Devtool-Main.uxml");
                rootElement = uxmlAsset.CloneTree();

                StyleSheet uss = AssetDatabase.LoadAssetAtPath<StyleSheet>("Packages/com.tencent.puerts.webgl.devtool/Editor/Devtool-Main.uss");
                rootElement.styleSheets.Add(uss);

                rootVisualElement.Add(rootElement);
                rootElement.Q<Button>("build-preview").clickable.clicked += PreviewCurrentScene;
                rootElement.Q<Button>("server-switch").clickable.clicked += SwitchServer;
                rootElement.Q<Button>("rebuild-preview-project").clickable.clicked += BuildPreviewProject;
            }

            public void OnInspectorUpdate()
            {
                var label = rootElement.Q<Label>("server-status");
                if (IsPreviewServerAlive)
                {
                    label.text = "preview server on";
                    label.RemoveFromClassList("off");
                    label.AddToClassList("on");
                }
                else
                {
                    label.text = "preview server off";
                    label.RemoveFromClassList("on");
                    label.AddToClassList("off");
                }
            }

#if UNITY_WEBGL
            [PostProcessBuild(1)]
            private static void OnBuildFinished(BuildTarget target, string pathToBuiltProject)
            {
                AfterBuild();
            }
#endif
            private static void AfterBuild()
            {
                WebGLPuertsPostProcessor.browser();
                var processHTML = getDevtoolEnv().ExecuteModule("puerts/webgl/devtool/processHTML.mts").Get<Action<string>>("default");
                processHTML(Path.GetFullPath("puer-build/previewer"));
            }

            private static void BuildPreviewProject()
            {
                var prevStripEngineCode = PlayerSettings.stripEngineCode;
                PlayerSettings.stripEngineCode = false;
                BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
                buildPlayerOptions.scenes = new[] { PreviewScenePath };
                buildPlayerOptions.locationPathName = "puer-build/previewer";
                buildPlayerOptions.target = BuildTarget.WebGL;
                buildPlayerOptions.options = BuildOptions.None;
                
                BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
                BuildSummary summary = report.summary;

                if (summary.result == BuildResult.Succeeded)
                {
                    Debug.Log("Build succeeded: " + summary.outputPath + " with " + summary.totalSize + " bytes");
                }

                if (summary.result == BuildResult.Failed)
                {
                    Debug.Log("Build failed: " + summary.outputPath);
                }

                PlayerSettings.stripEngineCode = prevStripEngineCode;
            }

            private static void BuildAssetBundleForCurrentScene()
            {
                var scenePath = SceneManager.GetActiveScene().path;
                if (String.IsNullOrEmpty(scenePath))
                {
                    UnityEngine.Debug.LogError("Invalid current scene");
                    return;
                }

                string outputPath = "puer-build/assetsbundle";
                Directory.CreateDirectory(outputPath);
                var build = new AssetBundleBuild();
                build.assetBundleName = "preview_asset_bundle";
                build.assetNames = new string[] { scenePath };
                BuildPipeline.BuildAssetBundles(outputPath, new AssetBundleBuild[] { build }, BuildAssetBundleOptions.None, BuildTarget.WebGL);
            }

            private static void PreviewCurrentScene()
            {
                if (SceneManager.GetActiveScene().path == PreviewScenePath)
                    throw new Exception("could not preview the previewScene itself");
                BuildAssetBundleForCurrentScene();
                TSReleaser.ReleaseToResources();
                if (!Directory.Exists(Path.GetFullPath("puer-build/previewer")))
                {
                    Directory.CreateDirectory("puer-build/previewer");
                    BuildPreviewProject();
                }
                else
                {
                    AfterBuild();
                }
                
                var killProc = Process.Start(new ProcessStartInfo
                {
                    Arguments = (Application.platform == RuntimePlatform.WindowsEditor ? "/c start " : "") + "http://127.0.0.1:8080/previewer/",
                    FileName = Application.platform == RuntimePlatform.WindowsEditor ? "cmd.exe" : "open",
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true
                });
                if (killProc != null) killProc.WaitForExit();
            }
        }
    }
}