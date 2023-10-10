[跳转中文](#tsloader-解决普洱下使用typescript的大部分问题)

# TSLoader: Solving Most TypeScript-related Issues in PuerTS

> Core Features:

- PuerTS Loader allows directly loading TypeScript in the editor.
- No need to delve into tsconfig, ESM, CommonJS; no manual TypeScript compilation required; no need to worry about debugging aspects such as debugpath, source maps, or console navigation.

> Additional Features:

- Seamless switching between custom Loaders during runtime.
- Organize multiple Loaders in a chain during runtime.
- Includes a built-in subloader: NodeModuleLoader, capable of loading packages from node_modules directly.
- Easily create TypeScript within the Asset panel like C#.
- Treat TypeScript files as ScriptableObjects, draggable onto the editor panel.
- Develop your own tools by using TSLoader's API to uniformly compile TypeScript into JavaScript files before publishing.

## Getting Started

1. Make sure that you have installed PuerTS using the UPM (Unity Package Manager), which can be done through OpenUPM or by cloning the repository and `add from file` in UPM window or just copy the `upm` directory to your `Packages/` directory(don't copy to `Assets/` directory plz).
2. Load this package using the UPM same as how you loaded PuerTS. The OpenUPM package name for this package is **`com.tencent.puerts.ts-loader`**.
3. Create a directory structure like this:
    
    ```lua
     |- Assets
     |-- TypeScripts
     |--- tsconfig.json
     |--- main.mts
     |-- Script.cs (a MonoBehaviour)
    ```
    
4. Drag the **`Script.cs`** into your scene. In the **`Start()`** method of **`Script.cs`**, use the following code to see the effect:
    
    ```csharp
    var env = new Puerts.JsEnv(new Puerts.TSLoader());
    env.ExecuteModule("main.mts");
    ```
    

> If PuerTS itself is not installed using UPM, you can clone the ts-loader project and add the upm directory to Unity. Please note that the PuerTS core should be the Node.js version.
> 

## Detailed Examples

This package follows the UPM package structure, and examples are located in the **`upm/Samples`** directory.

1. Sample 1 - Basic Example
    
    This is the simplest example. It loads TS files from the **`Assets`** directory in the Editor and organizes two Loaders in a chain during Runtime. You can also test the effect of Runtime Loaders within the Editor by using **`PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE`**.
    
2. Sample 2 - Integration with webpack and node_modules
    
    This example demonstrates how to add a TSProject located outside the **`Assets`** directory. It uses webpack to bundle code from **`node_modules`** into separate JS files (to solve the problem of publishing **`node_modules`**). These individual JS files are then used by TS controlled by TSLoader.
    
3. Sample 3 - Testing Debugger, Source Maps, and Console Redirect
4. Sample 4 - Directly Loading node_modules
    
    This example shows how to load **`node_modules`** directly within TS. Note: This example works in the Editor and has only been tested in the Editor environment.
    
5. **Samples from [puerts-webgl](https://github.com/zombieyang/puerts_unity_webgl_demo)**
    
    Sample 2, 8, and 9 from the **`puerts-webgl`** project all utilize **`ts-loader`**.
    

## Migration Guide

Applying **`TSLoader`** to an existing PuerTS project is straightforward and should not lead to any backward compatibility issues.

Firstly, if your original project did not pass a Loader when creating the JsEnv, you can simply create a **`TSLoader`** and pass it when creating the JsEnv, as shown previously.

If you previously had a custom Loader, like **`new JsEnv(LoaderA)`**, you can make the following modifications:

```csharp
var loader = new TSLoader();
loader.UseRuntimeLoader(LoaderA);
JsEnv env = new JsEnv(loader);
```

This way, you can use **`TSLoader`** in the Editor while not affecting the usage of your existing logic.

## TS Loading Explanation

In **`ts-loader`**, every **`tsconfig`** and its associated directory and subdirectories are considered a **TS project** (somewhat similar to asmdef concepts). **`ts-loader`** in the Unity Editor automatically scans all directories for **`tsconfig`** files and records their locations.

All TypeScript files can be loaded using their path **relative to the tsconfig.json file** with the **`ExecuteModule`** function (e.g., as shown earlier with **`main.mts`**). If you create a TypeScript file with a path relative to the **`tsconfig`** like **`./lib/sub.mts`**, you can load it using **`ExecuteModule('./lib/sub.mts')`**.

Across different **`tsconfig`** files, TypeScript files can be mutually loaded. For example, a TypeScript file relative to **`tsconfig`** A, **`./main.mts`**, can be loaded using **`import './sub.mts'`** relative to **`tsconfig`** B, regardless of the locations of **`tsconfig`** A and **`tsconfig`** B. However, you need to configure your **`tsconfig`** appropriately to get code completion for TypeScript files from other **`tsconfig`** files. Refer to **[Explanation of Cross `tsconfig` References](#explanation-of-cross-tsconfig-references)** for more details.

You can also place JavaScript files under the **`tsconfig`**, and they can be loaded in the same way as mentioned above. However, you need to add **`compilerOptions.allowJS = true`** to your **`tsconfig`** for this to work.

> In the current version, avoid adding another tsconfig within the scope controlled by an existing tsconfig.
> 

## Explanation of Cross `tsconfig` References

**`ts-loader`** itself supports TypeScript **`import`** statements across different **`tsconfig`** files, but you need to configure it properly to get accurate TypeScript code completion in your editor. Here's how you can set it up:

1. Project References
    
    This configuration is at the same level as **`compilerOptions`**. Without this configuration, you won't get content exported from other TypeScript files.
    
    ```json
    "references": [
        {
            "path": "path-to-another-tsconfig"
        },
        {
            "path": "path-to-another-tsconfig"
        }
    ]
    ```
    
2. Paths
    
    This configuration is within **`compilerOptions`**. If not configured, the automatically completed paths will have a lot of relative symbols, making them unusable with **`ts-loader`**.
    
    ```json
    "paths": {
        "*": [
            "path-to-another-tsconfig/*",
            "path-to-another-tsconfig/*"
        ]
    }
    ```
    
3. Module
    
    This configuration is within **`compilerOptions`**. It is used to specify the output module format. Only when configured as **`None`** or **`commonjs`** will you get accurate code completion from your project in other places. I'm not sure if this is a bug, but this configuration will be changed to ES2015 when **`ts-loader`** processes TypeScript, so it's recommended to set it to **`None`** in your project.
    

Make sure to set up these configurations in your **`tsconfig`** files for proper cross **`tsconfig`** references and accurate code completion when using **`ts-loader`**.

## Compilation During Publishing

TSLoader includes a built-in **`TSReleaser-Resources.cs`** that compiles all TypeScript files managed by TSLoader and places them in the **`Gen/Resources`** directory. This allows them to be loaded by the built-in **`DefaultLoader`** in PuerTS.

If you wish to publish TypeScript files managed by TSLoader in a different form, you can refer to **`ReleaseToResources.cs`**, where the **`ReleaseAllTS`** method may assist you.

## TODO

- Remove dependencies on Node.js

## Acknowledgments

Thanks for **[@throw-out](https://github.com/throw-out)** providing key support for source maps and ConsoleRedirect.

-----

<h1 id="1">TSLoader: 解决普洱下使用Typescript的大部分问题</h2>

> 核心功能：

  * 提供一个PuerTS的Loader，使你在Editor下，可以直接读取TS。
  * 无需研究tsconfig、无需研究ESM、CommonJS，无需自行编译ts，无需理会和调试相关的debugpath/sourceMap/控制台跳转。

> 其他功能
  * 在Runtime下，依然可以使用自己Loader，无缝切换
  * 在Runtime下，以链式组织多个Loader
  * 自带了一个子loader：NodeModuleLoader，可以直接加载node_modules里的包
  * 可在Asset面板中直接创建Typescript，就像C#一样。
  * 将Typescript文件视为ScriptableObject，可拖入Editor面板上。
  * 可以编写自己的工具，通过TSLoader的API，在发布前将Typescript统一编译为js文件。
  
[我为什么要做TSLoader](https://zhuanlan.zhihu.com/p/614569767)

## 如何开始
1. 确认你已通过upm方式安装好PuerTS，可以用openupm、也可以clone后add from file、也可以下载本仓库后将upm目录丢到Packages下（请勿放在Assets里）。
2. 通过upm方式加载本包，加载方式请与PuerTS保持一致。本包的openupm包名为`com.tencent.puerts.ts-loader`
3. 创建这样的目录结构
  ```
    |- Assets
    |-- TypeScripts
    |--- tsconfig.json
    |--- main.mts
    |-- Script.cs (是个MonoBehaviour)
  ```
5. 将Script.cs拖入场景，在Script.cs的Start()使用如下代码即可看到效果
```
var env = new Puerts.JsEnv(new Puerts.TSLoader());
env.ExecuteModule("main.mts");
```
> 如果PuerTS本体不使用UPM安装，可以自行clone ts-loader项目并将upm目录添加至Unity。且注意PuerTS本体需要用Node.js版
## 详细示例
本包遵循UPM包结构。示例位于`upm/Samples`
1. Sample 1 - 简单示例

    最简单的示例，Editor下加载Assets目录下的TS，Runtime下通过链式组织两个Loader完成加载工作。
    且通过PUERTS_TSLOADER_DISABLE_EDITOR_FEATURE，可以在Editor内测试Runtime下的Loader的效果。
2. Sample 2 - 与webpack和node_modules配合

    演示了如何添加一个Assets目录外的TSProject。
    该Project使用webpack，将node_modules里的代码打包成为单独的JS（为了解决node_modules不好发布的问题）。这些单独的JS再被TSLoader控制中的TS所使用。
3. Sample 3 - 调试器、sourceMap、ConsoleRedirect的测试
4. Sample 4 - 直接加载node_modules

    演示了ts里如何直接加载node_modules。这个方法适合用于Editor，目前仅在Editor下测试过。
5. [puerts-webgl](https://github.com/zombieyang/puerts_unity_webgl_demo) 的Sample 2/8/9 都使用了ts-loader


## 迁移指南
如果你已经有一个Puer项目，想使用`TSLoader`非常简单，不会出现不向下兼容的情况。

首先，如果你原项目在创建JsEnv时就没有传递Loader，那只需要在创建JsEnv时，像上面一样创建TSLoader并传入就行。

如果你以前已经有自定义Loader，比如`new JsEnv(LoaderA)`，那么你可以这样修改：
```
        var loader = new TSLoader();
        loader.UseRuntimeLoader(LoaderA);
        JsEnv env = new JsEnv(loader);

```
这样你就可以在编辑器里使用TSLoader的方式，同时不影响你原有逻辑的使用。


## TS加载说明
在`ts-loader`概念里，每个`tsconfig`以及它所在的目录与子目录，会被认为是一个**TS项目**（有点类似asmdef的概念）。ts-loader在Unity编辑器下会自动扫描所有目录下的`tsconfig`，记录他们的位置。

所有Typescript文件都可以用它`相对于tsconfig.json的路径`，被ExecuteModule加载到（比如上文中的`main.mts`）。如果你创建ts的路径相对于`tsconfig`是`./lib/sub.mts`，那你就可以通过`ExecuteModule('./lib/sub.mts')`加载它。

不同的tsconfig间，其下的ts文件可以互相加载，比如相对于tsconfig A的`./main.mts`，可以通过`import './sub.mts'`加载相对于tsconfig B的`./sub.mts`。而无论tsconfig A和tsconfig B各自放在哪个位置。但这种情况下，你需要在tsconfig里做好配置，才能获得其他tsconfig下ts文件的代码提示。详见[tsconfig间引用说明](#tsconfig间引用说明)

tsconfig下也可以放置js文件，且能像上述方式一样加载，但需要你在`tsconfig`里添加`compilerOptions.allowJS = true`

> 当前版本请勿在一个tsconfig控制的范围内添加另一个tsconfig

## tsconfig间引用说明
ts-loader本身支持tsconfig之间的ts互相`import`，但你需要做一些配置才能让编辑器的`tsc`给你正确的提示
1. project references
   
   这个是与`compilerOptions`同级的配置，若不配置，则无法获得别的ts导出的内容。配置方式如下：
```
 "references": [
     {
         "path": "另一个tsconfig的路径"
     },
     {
         "path": "另一个tsconfig的路径"
     }
 ]
```
2. paths
   
   这个是在`compilerOptions`里的配置，如果不配置，则自动完成的加载路径会有一堆相对符号，最终无法被ts-loader处理。
```
"*": [
    "另一个tsconfig的路径/*",
    "另一个tsconfig的路径/*"
]
```
3. module
   
   这个是`compilerOptions`里的配置。没错就是用于指定输出模块格式的。只有配置为`None`或者`commonjs`，别的地方才能正确获得本项目的代码提示。本人不确定这是不是Bug。但总之该配置项会在ts-loader最终处理ts时统一改为ES2015，因此建议你在项目中填`None`
   
## 发布时的编译
TSLoader内置了一个`TSReleaser-Resources.cs`，会将所有TSLoader所管理的Typescript文件编译并放到`Gen/Resources`目录。这样就可以被普洱内置的`DefaultLoader`所加载。

如果你希望把TSLoader所管理的Typescript文件发布成别的形式，可以直接参考`ReleaseToResources.cs`，里面的`ReleaseAllTS`方法可能可以帮到你。
   
## TODO
* 解除对Node的依赖

## 鸣谢
[@throw-out](https://github.com/throw-out) 提供了最为关键的sourceMap和ConsoleRedirect的支持。
