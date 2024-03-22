using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Codice.Utils;

public static class WebGLUtils
{
    public static Dictionary<string, string> Concat(params Dictionary<string, string>[] dicts)
    {
        Dictionary<string, string> results = new Dictionary<string, string>();

        foreach (var dict in dicts)
        {
            if (dict == null)
                continue;
            foreach (var member in dict)
            {
                results[member.Key] = member.Value;
            }
        }
        return results;
    }

    public delegate string ResolvePathFunction(string path);
    public static Func<string, string> GetBuildinResolvePathFunction()
    {
        var resolves = from assembly in AppDomain.CurrentDomain.GetAssemblies()
                       where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
                       from type in assembly.GetExportedTypes()
                       from method in type.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
                       where method.IsDefined(typeof(WebGLResolvePath)) && !method.IsGenericMethod
                       where method.ReturnType == typeof(string) && method.GetParameters().Length == 1 && method.GetParameters()[0].ParameterType == typeof(string)
                       select (ResolvePathFunction)method.CreateDelegate(typeof(ResolvePathFunction), null);
        if (resolves.Count() == 0)
            return null;

        return (path) =>
        {
            string result = null;
            foreach (var resolve in resolves)
            {
                string newPath = resolve(path);
                if (!string.IsNullOrEmpty(newPath) && newPath != path)
                {
                    result = newPath;
                }
            }
            return !string.IsNullOrEmpty(result) ? result : path;
        };
    }
    public delegate bool FilterFunction(string path);
    public static Func<string, bool> GetBuildinFilterFunction()
    {
        var filters = from assembly in AppDomain.CurrentDomain.GetAssemblies()
                      where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
                      from type in assembly.GetExportedTypes()
                      from method in type.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
                      where method.IsDefined(typeof(WebGLResolvePath)) && !method.IsGenericMethod
                      where method.ReturnType == typeof(bool) && method.GetParameters().Length == 1 && method.GetParameters()[0].ParameterType == typeof(string)
                      select (FilterFunction)method.CreateDelegate(typeof(FilterFunction), null);
        if (filters.Count() == 0)
            return null;

        return (path) =>
        {
            foreach (var filter in filters)
            {
                if (!filter(path))
                    return false;
            }
            return true;
        };
    }

    public static Dictionary<string, string> GetBuildinScriptsFromConfigure()
    {
        var members = from assembly in AppDomain.CurrentDomain.GetAssemblies()
                      where !(assembly.ManifestModule is System.Reflection.Emit.ModuleBuilder)
                      from type in assembly.GetExportedTypes()
                      from method in type.GetMethods(BindingFlags.Static | BindingFlags.Public | BindingFlags.NonPublic)
                      where method.IsDefined(typeof(WebGLScripts)) && !method.IsGenericMethod
                      where typeof(Dictionary<string, string>).IsAssignableFrom(method.ReturnType) && method.GetParameters().Length == 0
                      select (Dictionary<string, string>)method.Invoke(null, null);
        if (members.Count() == 0)
            return null;

        return Concat(members.ToArray());
    }
    public static Dictionary<string, string> GetBuildinScriptsFromOutputPath(string outputRootPath, string extensioName)
    {
        if (string.IsNullOrEmpty(outputRootPath) || !Directory.Exists(outputRootPath))
            return null;

        Func<string, bool> filter = (string file) =>
        {
            return file != null && (file.EndsWith(".js") || file.EndsWith(".cjs") || file.EndsWith(".mjs"));
        };

        outputRootPath = outputRootPath.Replace("\\", "/");
        if (!outputRootPath.EndsWith("/"))
        {
            outputRootPath += "/";
        }

        Dictionary<string, string> results = new Dictionary<string, string>();

        foreach (string file in ScanFiles(outputRootPath, filter))
        {
            string resourceName = file.Replace("\\", "/").Replace(outputRootPath, "");
            if (!string.IsNullOrEmpty(extensioName) && Path.GetExtension(resourceName) != extensioName)
            {
                resourceName = resourceName.Substring(0, resourceName.Length - Path.GetExtension(resourceName).Length) + extensioName;
            }

            results[resourceName] = System.Text.Encoding.UTF8.GetString(File.ReadAllBytes(file));
        }
        return results;
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
}
/// <summary>
/// 允许自定义处理js文件路径
/// </summary>
[AttributeUsageAttribute(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class WebGLResolvePath : Attribute
{
}
/// <summary>
/// 允许自定义过滤js文件
/// </summary>
[AttributeUsageAttribute(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class WebGLFilterPath : Attribute
{
}
/// <summary>
/// 允许自定义添加构建内容
/// </summary>
[AttributeUsageAttribute(AttributeTargets.Method, Inherited = false, AllowMultiple = false)]
public class WebGLScripts : Attribute
{

}