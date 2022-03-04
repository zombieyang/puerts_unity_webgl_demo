# Puerts WebGL demo
本项目包括了一个可以以WebGL模式构建运行Puerts的Unity项目。puerts的JS代码会运行在浏览器JS引擎里，而不是运行在编译为WASM的JS解释器里。

支持Unity 2019+

## Demos
* 简单旋转demo`Assets/Scenes/SampleScene` ✔
* 篮球小游戏demo`Assets/Scenes/BasketballDemo` ✔

#### 浏览器环境运行方式：
1. 执行WebGL Build
2. 根据命令行提示，使用puerts提供的editor菜单生成为浏览器环境所用的js。
3. 如果是浏览器环境，修改生成好的html，在<head>中添加<script>，将刚刚生成的两个js加上去
#### 微信小游戏环境运行方式：
还有一些问题没解决，暂不写文档。有需要请在issue留言或qq群里联系我。

## Performance
因为在这套架构下，JS是运行在宿主JS环境下的，有JIT的支持，因此相比Lua脚本方案，在*执行性能*上有碾压性的性能优势。
|       | 10万次 fibonacci(12) |
| ---  |    ---    |
|xLua WebGL   |    6200ms    |
|本Puerts WebGL方案 |   165ms     |

## Dependent
因为大量使用到了`WeakRef`和`FinalizationRegistry`API。该功能在以下环境下可用：
1. V8 8.4+ (eg. Chrome 84+) 或是打开`--harmony-weak-refs`的v8 7.4+
2. iOS Safari 14.5+/OSX Safari 14.1+

## How to contrib
* 运作原理(how this work?)

Puerts的WebGL版本是利用Unity官方提供的[Unity代码与浏览器脚本交互的功能](https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html)，对Puerts中使用到的`PuertsDLL.cs`里的API通过JS一一进行实现。关键代码位于`Assets/Plugins/puerts.jslib`以及`puerts-webgl/PuertsDLLMock`。

* 未来还有以下工作要做(TODO)：

1. 在jslib实现out系列API以及JSObject
