# PuerTS-webgl js构建示例工具

由于puerts-webgl的架构里，JS文件是运行在浏览器宿主JS引擎上的。因此，JS不应Unity的资源系统进行加载（尤其是微信小游戏里，必须这样做）
 
所以，PuerTS在webgl上JsEnv.ExecuteModule执行JS时，并不会使用Loader进行JS加载。

### 那么JS是怎么执行的呢？
答案在 Javascripts/PuertsDLLMock/index.ts的ExecuteModule函数中。
 * 在浏览器里，Puer会找全局变量PUERTS_JS_RESOURCES，它是一个key-value结构，记载着ExecuteModule会使用到的所有JS的内容。
 * 在微信小游戏里，则是直接将ExecuteModule接收到的JS名传递给微信的require，require会去找puerts_minigame_js_resources下的JS。

### 这个工具做了什么事
本工具可以收集所有Resources目录下的JS，为浏览器环境生成PUERTS_JS_RESOURCES，以及为微信小游戏生成`puerts_minigame_js_resources`目录。

如果你的游戏使用的就是Puerts.DefaultLoader进行js加载，那么这个示例工具可以直接解决需求

如果你的游戏里使用了自定义的Loader，你可以参照这个工具自己重新实现一个PostProcessor，以和你的Loader配套。 