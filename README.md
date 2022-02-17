# Puerts WebGL demo
本项目包括了一个可以以WebGL模式构建运行Puerts的Unity项目。puerts的JS代码会运行在浏览器JS引擎里，而不是运行在编译为WASM的JS解释器里。

支持Unity 2019+

## Demos
* 简单旋转demo`Assets/Scenes/SampleScene` ✔
* 篮球小游戏demo`Assets/Scenes/BasketballDemo` ✔

## Dependent
因为大量使用到了`WeakRef`和`FinalizationRegistry`API。该功能在以下环境下可用：
1. V8 8.4+ (eg. Chrome 84+) 或是打开`--harmony-weak-refs`的v8 7.4+
2. iOS Safari 14.5+/OSX Safari 14.1+

想在微信里使用的朋友，在iOS需要打开高性能模式，安卓需要稍晚一点。

关于微信环境如果需要协助，请在官方qq群内找到我与我联系。

## How to contrib
* 运作原理(how this work?)

Puerts的WebGL版本是利用Unity官方提供的[Unity代码与浏览器脚本交互的功能](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html)，对Puerts中使用到的`PuertsDLL.cs`里的API通过JS一一进行实现。关键代码位于`Assets/Plugins/puerts.jslib`以及`puerts-webgl/PuertsDLLMock`。

* 未来还有以下工作要做(TODO)：

1. 在jslib实现out系列API以及JSObject