## 如何开始
开发阶段，请跟随项目首页的指引进行。上小游戏仅仅只有构建阶段工作不同。

如何构建：
1. 通过[微信提供的webgl转化项目](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform)进行WebGL Build
2. 使用`puerts-webgl`里的构建功能生成为微信环境所用的js。
3. 在构建出来的小游戏`game.js`中，添加require('puerts-runtime.js')
4. iOS下请跟随[该指引](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform/blob/main/Design/iOSOptimization.md)申请高性能模式，即wkwebview模式。开了该模式才有JIT以及WeakRef

> puerts-webgl不支持 ios14.0~14.4 的小游戏环境，接入时请做一下这几个版本的屏蔽。

## 示例微信小游戏（后来的就不公布了）
| 作者 | 码 |
| --- | --- |
| [zgz682000](https://github.com/zgz682000) | <img src="./doc/pic/game1.jpg" alt="Game1" width="100" height="100"/> |
| [ctxdegithub](https://github.com/ctxdegithub) | <img src="./doc/pic/game2.jpg" alt="Game2" width="100" height="100"/> |

## FAQ
#### * 我的JS太多了，做微信小游戏的话，在开发者工具里运行时提示代码过大，应该如何处理？

参见微信平台的[代码分包](https://developers.weixin.qq.com/minigame/dev/guide/base-ability/subPackage/useSubPackage.html)文档，将JS目录下的部分JS拆分成子包。

#### * 为什么Loader不工作？

在WebGL下，尤其是微信小游戏下，受限于平台策略，普洱无法使用Loader的形式加载代码文本并执行。参见 [wiki](https://github.com/zombieyang/puerts_unity_webgl_demo/wiki/%E6%95%99%E5%AD%A6%E6%AD%A5%E9%AA%A4%E4%B8%AD%EF%BC%8C%60%E6%9E%84%E5%BB%BA%60%E5%AE%9E%E9%99%85%E5%81%9A%E4%BA%86%E4%BB%80%E4%B9%88%EF%BC%9F)
