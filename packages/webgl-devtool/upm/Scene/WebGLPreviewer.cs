using System.Collections;
using System.Collections.Generic;
using UnityEditor;
using UnityEngine;
using UnityEngine.Networking;
using System.Threading.Tasks;
using System;
using System.Runtime.CompilerServices;
using UnityEngine.SceneManagement;

public class WebGLPreviewer : MonoBehaviour
{
    private async void Start()
    {
        // 下载AssetBundle
        UnityEngine.Debug.Log("loading preview asset bundle");
        UnityWebRequest request = UnityWebRequestAssetBundle.GetAssetBundle("http://127.0.0.1:8080/assetsbundle/preview_asset_bundle");
        await request.SendWebRequest();
        
        if (request.result != UnityWebRequest.Result.Success)
        {
            Debug.LogError("Failed to download AssetBundle: " + request.error);
            return;
        }
        
        // 加载AssetBundle
        AssetBundle bundle = DownloadHandlerAssetBundle.GetContent(request);
        UnityEngine.Debug.Log("previewing" + bundle.GetAllScenePaths()[0]);
        SceneManager.LoadScene(bundle.GetAllScenePaths()[0]);
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}

public class UnityWebRequestAwaiter : INotifyCompletion
{
    private UnityWebRequestAsyncOperation asyncOp;
    private Action continuation;

    public UnityWebRequestAwaiter(UnityWebRequestAsyncOperation asyncOp)
    {
        this.asyncOp = asyncOp;
        asyncOp.completed += OnRequestCompleted;
    }

    public bool IsCompleted { get { return asyncOp.isDone; } }

    public void GetResult() { }

    public void OnCompleted(Action continuation)
    {
        this.continuation = continuation;
    }

    private void OnRequestCompleted(AsyncOperation obj)
    {
        continuation();
    }
}

public static class ExtensionMethods
{
    public static UnityWebRequestAwaiter GetAwaiter(this UnityWebRequestAsyncOperation asyncOp)
    {
        return new UnityWebRequestAwaiter(asyncOp);
    }
}