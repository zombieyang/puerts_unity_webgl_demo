# Puerts WebGL demo
本项目包括了一个可以以WebGL模式构建运行Puerts的Unity项目。puerts的JS代码会运行在浏览器JS引擎里，而不是运行在编译为WASM的JS解释器里。
> You can build a unity puerts project in webgl mode now. Your Javascript code will run in browser Javascript engine instead of a interpreter in WASM.

## Progress
* unity 2019支持 ✔
* unity 2020支持 ×
* 简单旋转demo`Assets/Scenes/SampleScene` ✔
* 篮球小游戏demo`Assets/Scenes/BasketballDemo` ×

## Dependent
因为大量使用到了`WeakRef`和`FinalizationRegistry`API。该功能在以下环境下可用：
> This feature will deeply depend the `WeakRef` and `FinalizationRegistry` API. Which are supported in below environment:
1. V8 8.4+ (eg. Chrome 84+)
2. iOS Safari 14.5+/OSX Safari 14.1+

## How to contrib
* 运作原理(how this work?)

Puerts的WebGL版本是利用Unity官方提供的[Unity代码与浏览器脚本交互的功能](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html)，对Puerts中使用到的`PuertsDLL.cs`里的API通过JS一一进行实现。关键代码位于`Assets/Plugins/puerts.jslib`。
> With [this Manual](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html) which provided by Unity. We implements a jslib located at `Assets/Plugins/puerts.jslib`. It should provide the API in `PuertsDLL.cs` which support Puerts to run.

* 未来还有以下工作要做(TODO)：

1. 确认在wkwebview下的支持情况（理论上Safari可以就可以）
2. 在jslib实现剩余的PuertsDLL.cs的API
3. 验证包括IntPtr管理、JSFunction在内的各种内存管理机制是否正常