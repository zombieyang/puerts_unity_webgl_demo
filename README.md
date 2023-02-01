# Puerts WebGL Unity
![puerts_webgl](https://img.shields.io/badge/release-v1.0.0-blue.svg)
![minigame](https://img.shields.io/badge/-minigame-grey.svg?logo=wechat)

## introduction | 简介

* With this project. Unity Puer's JS Code will run in the v8 of browser instead of v8/quickjs in WebAssembly.
* 通过该项目的支持，Unity puer的JS代码会运行在宿主JS引擎里，而不是运行在编译为WASM的JS解释器里。

## Advantage | 优势

* High Efficiency | 开发很快
  * all the JS file can run in browser directly. you dont have to rebuild the unity project after JS script is modified.
  * 所有JS逻辑文件都可以直接在宿主JS环境跑，因此你不需要在每次改完脚本代码后重新构建unity项目了。

* Fast | 执行很快
  * with the JIT in browser's v8. Puer Webgl has a huge *execute performance* advantage.
  * 因为在这套架构下，JS是运行在宿主JS环境下的，有JIT的支持，因此相比Lua脚本方案，在*执行性能*上有碾压性的性能优势。

      |       | 100k fibonacci(12) |
      | ---  |    ---    |
      |xLua WebGL   |    6200ms    |
      |Puerts WebGL |   165ms     |

## QuickStart | 开始

#### learn puerts | 建议先了解PuerTS本体
* PuerTS is not only developed for WebGL game development. It allows you to write Typescript in Unity native game too.
* PuerTS并不是只针对WebGL游戏开发的框架，它本身支持你在原生Unity中编写Typescript

* So. the guidance below is assumed that you already know something about puerts. Or you can learn about it in [Tencent/puerts](https://github.com/Tencent/puerts)
* 下列指引都是假设你已经有对PuerTS本身足够的了解。您可以先在 [Tencent/puerts](https://github.com/Tencent/puerts) 获得一些知识再往下进行。

#### have a try | 体验一下效果

* start a http server in `build` directory. you can quickly try these 4 demo which is built by Unity2019.
* 在build目录启动一个httpserver，通过网页访问即可看到4个demo的效果，它们是Unity2019编译产生的。

1. Simple Rotate Demo | 简单旋转demo
2. Basketball Game Demo | 篮球小游戏demo
3. UnitTest
4. Compare with XLua WebGL | 和 xLua WebGL 进行fibonacci 性能对比测试demo

#### How to rebuild | 如何重新构建？
1. Open any project in `projects` | 打开`projects`下的任意项目
2. Click `puerts-webgl/install` in the Menu | 点击`puerts-webgl/install`
3. Do Unity WebGL Build | 执行Unity的WebGL Build
4. Click `puerts-webgl/build for browser` following the tips in console | 根据命令行提示，点击`puerts-webgl/build for browser`将JS拷贝到构建目录
5. append these code befoew `</head>` in index.html built by Unity: | 将下述代码放到index.html的</head>前
```
  <script src="./puerts-runtime.js"></script>
  <script src="./puerts_browser_js_resources.js"></script>
```

#### install in your own project | 在你自己的项目中安装

* [Install puerts](https://github.com/Tencent/puerts/blob/master/doc/unity/install.md) first (by upm). then: | 首先[安装puerts](https://github.com/Tencent/puerts/blob/master/doc/unity/install.md) (注意要用upm的方式)。随后：

    <details>
    <summary>Add from OpenUPM | available in 2018+</summary>

    你可按照[OpenUPM](https://openupm.com/)所支持的方式安装该包：https://openupm.com/packages/com.tencent.puerts.webgl/

    </details>

    <details>
    <summary>Add from GitHub | available in 2019.4+</summary>

    You can add it directly from GitHub on Unity 2019.4+. Note that you won't be able to receive updates through Package Manager this way, you'll have to update manually.

    - open Package Manager
    - click <kbd>+</kbd>
    - select <kbd>Add from Git URL</kbd>
    - paste `https://github.com/zombieyang/puerts_unity_webgl_demo.git?path=/package`
    - click <kbd>Add</kbd>
    </details>


#### About WeChat minigame | 关于微信小游戏？
[点我](./minigame.md)
  

----------------------------------------------

## How to contrib
* 运作原理(how this work?)

Puerts的WebGL版本是利用Unity官方提供的[Unity代码与浏览器脚本交互的功能](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html)，对Puerts中使用到的`PuertsDLL.cs`里的API通过JS一一进行实现。关键代码位于`Assets/Plugins/puerts.jslib`以及`puerts-webgl/PuertsDLLMock`。

----------------------------------------------
## FAQ
##### 1. I got this error: | 我遇到了这个错误
> Unable to parse Build/H5.framework.js.gz! This can happen if build compression was enabled but web server hosting the content was misconfigured to not serve the file with HTTP Response Header "Content-Encoding: gzip" present. Check browser Console and Devtools Network tab to debug.
  * set `Player Settings > Publish Settings > Compression Format` to `Disabled`. delete your previous build and rebuild.
  * 将 `Player Settings > Publish Settings > Compression Format` 设为 `Disabled`。删掉你上一次的构建产物，然后重新构建。

##### 2. the memory rise to 2GB+ during the early launching | 游戏一启动内存就暴涨到2GB+
  * generally, you can check the resources loading in your game. make sure that you disable the Unity builtin caching.
  * 一般来说，你可以检查一下你游戏的资源加载流程，确认关掉了资源加载的cache。

##### 3. I'm going to migrate my old PuerTS Game to this. How can I do this ? | 我需要将我过往的PuerTS游戏迁移过来，有什么需要注意的吗？
  * If you are on 1.4+ of PuerTS, nothing is needed to do for migrate.
  * 如果你使用的是1.4+版本的PuerTS，那么没什么太多需要注意的。但如果是1.3以下，请关注 [这篇wiki](https://github.com/zombieyang/puerts_unity_webgl_demo/wiki/%E5%A6%82%E4%BD%95%E4%BB%8E%E5%8E%9F%E6%9C%89%E7%9A%84PuerTS%E9%A1%B9%E7%9B%AE%E4%B8%AD%E8%BF%81%E7%A7%BB%E8%BF%87%E6%9D%A5%EF%BC%9F)
  
##### 4. ILoader does not work | Loader在webGL下不工作
  * [wiki](https://github.com/zombieyang/puerts_unity_webgl_demo/wiki/%E6%95%99%E5%AD%A6%E6%AD%A5%E9%AA%A4%E4%B8%AD%EF%BC%8C%60%E6%9E%84%E5%BB%BA%60%E5%AE%9E%E9%99%85%E5%81%9A%E4%BA%86%E4%BB%80%E4%B9%88%EF%BC%9F)
  
----------------------------------------------

[Discord](https://discord.gg/RYRY7D833n)

<img src="https://user-images.githubusercontent.com/5595819/215939658-c35a65d1-86fb-4181-8e9c-fda9b29d412e.png" alt="qrcode" width="320" height="480"/>
(如果过期了，可到puerts官方群QQ私聊我)
