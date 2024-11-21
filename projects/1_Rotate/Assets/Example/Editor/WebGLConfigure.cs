using System.Collections.Generic;
using UnityEngine;

public static class WebGLConfigure
{
    [WebGLFilterPath]
    static bool Filter(string jsfile)
    {
        return !jsfile.Contains("Editor") && !jsfile.Contains("node_modules");
    }
    [WebGLResolvePath]
    static string Resolve(string jsfile)
    {
        Debug.Log("Buildin: " + jsfile);
        return jsfile;
    }
    /// <summary>
    /// 允许自定义添加构建内容: 此时可以扫描目录获取脚本列表
    /// </summary>
    /// <returns></returns>
    [WebGLScripts]
    static Dictionary<string, string> CustomScripts()
    {
        return new Dictionary<string, string>()
        {
            {"customScript1.mjs", "console.log('constom script')"}
        };
    }
}
