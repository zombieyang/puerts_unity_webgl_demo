using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;
using Puerts.TSLoader;

public class TestLoader: ILoader 
{
    public bool FileExists(string specifier) 
    {
        return specifier == "test.mjs";
    }

    public string ReadFile(string specifier, out string debugpath)
    {
        debugpath = "test.mjs";
        return "console.log('test Runtime')";
    }
}

public class TSLoaderExample : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        var loader = new TSLoader();
        // UseRuntimeLoader在Runtime下会形成链式处理。在Editor下不生效。
        // 执行顺序是Loader加入顺序的倒序

        // 通过菜单命令可以快速把TS构建到Resources目录供DefaultLoader使用   
        loader.UseRuntimeLoader(new DefaultLoader());
        // Editor下打开PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE可以测试runtime下的效果。
        loader.UseRuntimeLoader(new TestLoader());

        JsEnv env = new JsEnv(loader);
        env.ExecuteModule("test.mts");
        env.ExecuteModule("main.mts");
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
