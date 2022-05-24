# Puerts WebGL Unity
![puerts_webgl](https://img.shields.io/badge/release-v1.0.0_preview-blue.svg)

## introduction | 简介

* With this project. Unity Puer's JS Code will run in the v8 of browser instead of v8/quickjs in WebAssembly.
* 通过该项目的支持，Unity puer的JS代码会运行在浏览器JS引擎里，而不是运行在编译为WASM的JS解释器里。

## Advantage | 优势

* High Efficiency | 开发很快
  * all the JS file can run in browser directly. you dont have to rebuild the unity project after JS script is modified.
  * 所有JS逻辑文件都可以直接在宿主JS环境跑，因此你不需要在每次改完脚本代码后重新构建unity项目了。
  * 
* Fast | 执行很快
  * with the JIT in browser's v8. Puer Webgl has a huge *execute performance* advantage.
  * 因为在这套架构下，JS是运行在宿主JS环境下的，有JIT的支持，因此相比Lua脚本方案，在*执行性能*上有碾压性的性能优势。

|       | 100k fibonacci(12) |
| ---  |    ---    |
|xLua WebGL   |    6200ms    |
|Puerts WebGL |   165ms     |

## QuickStart | 开始

* start a http server in `build` directory. you can quickly try these 4 demo which is built by Unity2019.
* 在build目录启动一个httpserver，通过网页访问即可看到4个demo的效果，它们是Unity2019编译产生的。

1. Simple Rotate Demo | 简单旋转demo
2. Basketball Game Demo | 篮球小游戏demo
3. UnitTest
4. Compare with XLua WebGL | 和 xLua WebGL 进行fibonacci 性能对比测试demo

#### How to rebuild | 如何重新构建？
1. 打开Unity，在`puerts-webgl`菜单下点击install执行npm依赖的安装
2. 执行Unity的WebGL Build
3. 根据命令行提示，使用`puerts-webgl`里的构建功能生成为浏览器环境所用的js。
4. 如果是浏览器环境，修改生成好的html，在<head>中添加<script>，将刚刚生成的两个js加上去
```
  <script src="./puerts-runtime.js"></script>
  <script src="./puerts_browser_js_resources.js"></script>
```
  
#### About WeChat minigame | 关于微信小游戏？
[点我](./minigame.md)
  

----------------------------------------------

## Dependent | 依赖
* because of the dependent with `WeakRef` and `FinalizationRegistry`. this project is available in the environment below.
* 因为大量使用到了`WeakRef`和`FinalizationRegistry`API。该功能在以下环境下可用：

1. `V8 8.4+(Chrome 84+)` OR `v8 7.4+(Chrome 84+) with --harmony-weak-refs`
2. iOS Safari 14.5+/OSX Safari 14.1+
3. WeChat Minigame | 微信小游戏

## How to contrib
* 运作原理(how this work?)

Puerts的WebGL版本是利用Unity官方提供的[Unity代码与浏览器脚本交互的功能](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html)，对Puerts中使用到的`PuertsDLL.cs`里的API通过JS一一进行实现。关键代码位于`Assets/Plugins/puerts.jslib`以及`puerts-webgl/PuertsDLLMock`。

* 未来还有以下工作要做(TODO)：

1. 测试2021下bigint表现
