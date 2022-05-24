## 如何开始
1. 通过[微信提供的webgl转化项目](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform)进行WebGL Build
2. 使用`puerts-webgl`里的构建功能生成为微信环境所用的js。
3. 在构建出来的小游戏`game.js`中，添加require('puerts-runtime.js')
4. iOS下请跟随[该指引](https://github.com/wechat-miniprogram/minigame-unity-webgl-transform/blob/main/Design/iOSOptimization.md)申请高性能模式，即wkwebview模式。开了该模式才有JIT以及WeakRef


## 已上线微信小游戏
| 作者 | 码 |
| --- | --- |
| [zgz682000](https://github.com/zgz682000) | <img src="./doc/pic/game1.jpg" alt="Game1" width="100" height="100"/> |
| [ctxdegithub](https://github.com/ctxdegithub) | <img src="./doc/pic/game2.jpg" alt="Game2" width="100" height="100"/> |
