using UnityEditor;

public class BuildAssetBundles
{
    [MenuItem("Tools/Build AssetBundles")]
    static void BuildAllAssetBundles()
    {
        // 设置输出路径
        string outputPath = "build/assetsbundle";
        BuildPipeline.BuildAssetBundles(outputPath, BuildAssetBundleOptions.None, BuildTarget.WebGL);
    }
}