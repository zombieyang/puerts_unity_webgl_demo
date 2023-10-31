/**
 * 根据 https://docs.unity3d.com/2018.4/Documentation/Manual/webgl-interactingwithbrowserscripting.html
 * 我们的目的就是在WebGL模式下，实现和puerts.dll的效果。具体在于实现一个jslib，里面应包含PuertsDLL.cs的所有接口
 * 实验发现这个jslib虽然也是运行在v8的js，但对devtool调试并不友好，且只支持到es5。
 * 因此应该通过一个独立的js实现接口，puerts.jslib通过全局的方式调用它。
 * 
 * 最终形成如下架构
 * 业务JS <-> WASM <-> unity jslib <-> 本js
 * 但整条链路其实都在一个v8(jscore)虚拟机里
 */
import { JSFunction, global, PuertsJSEngine, jsFunctionOrObjectFactory } from "./library";
import WebGLBackendGetFromJSArgumentAPI from "./mixins/getFromJSArgument";
import WebGLBackendGetFromJSReturnAPI from "./mixins/getFromJSReturn";
import WebGLBackendRegisterAPI from "./mixins/register";
import WebGLBackendSetToInvokeJSArgumentApi from "./mixins/setToInvokeJSArgument";
import WebGLBackendSetToJSInvokeReturnApi from "./mixins/setToJSInvokeReturn";
import WebGLBackendSetToJSOutArgumentAPI from "./mixins/setToJSOutArgument";
import initRequire, { addSyntheticModule } from "./require";

global.wxRequire = global.require;

global.PuertsWebGL = {
    inited: false,
    debug: false,
    // puerts首次初始化时会调用这里，并把Unity的通信接口传入
    Init({
        UTF8ToString, _malloc, _memcpy, _free, stringToUTF8, lengthBytesUTF8, unityInstance
    }: PuertsJSEngine.EngineConstructorParam) {
        const engine = new PuertsJSEngine({
            UTF8ToString, _malloc, _memcpy, _free, stringToUTF8, lengthBytesUTF8, unityInstance
        });

        const executeModuleCache: { [filename: string]: any } = {};

        let jsEngineReturned = false;
        let loader: any;

        // PuertsDLL的所有接口实现
        global.PuertsWebGL = Object.assign(
            global.PuertsWebGL,
            { unityInstance },
            WebGLBackendGetFromJSArgumentAPI(engine),
            WebGLBackendGetFromJSReturnAPI(engine),
            WebGLBackendSetToInvokeJSArgumentApi(engine),
            WebGLBackendSetToJSInvokeReturnApi(engine),
            WebGLBackendSetToJSOutArgumentAPI(engine),
            WebGLBackendRegisterAPI(engine),
            {
                // bridgeLog: true,
                SetCallV8: function (
                    callV8Function: MockIntPtr,
                    callV8Constructor: MockIntPtr,
                    callV8Destructor: MockIntPtr
                ) {
                    engine.callV8Function = callV8Function;
                    engine.callV8Constructor = callV8Constructor;
                    engine.callV8Destructor = callV8Destructor;
                },
                GetLibVersion: function () {
                    return 32;
                },
                GetApiLevel: function () {
                    return 32;
                },
                GetLibBackend: function () {
                    return 0;
                },
                CreateJSEngine: function () {
                    if (jsEngineReturned) {
                        throw new Error("only one available jsEnv is allowed in WebGL mode");
                    }
                    jsEngineReturned = true;
                    return 1024;
                },
                CreateJSEngineWithExternalEnv: function () { },
                DestroyJSEngine: function () { },
                GetLastExceptionInfo: function (isolate: IntPtr,/* out int */strlen: any) {
                    return engine.JSStringToCSString(engine.lastException.stack, strlen);
                },
                LowMemoryNotification: function (isolate: IntPtr) { },
                IdleNotificationDeadline: function (isolate: IntPtr) { },
                RequestMinorGarbageCollectionForTesting: function (isolate: IntPtr) { },
                RequestFullGarbageCollectionForTesting: function (isolate: IntPtr) { },
                SetGeneralDestructor: function (isolate: IntPtr, _generalDestructor: IntPtr) {
                    engine.generalDestructor = _generalDestructor
                },
                GetInternalJSFunctionLib: function () {
                    function jsValueGetter(obj: any, key: string) {
                        return obj[key]
                    }

                    var jsfunc = jsFunctionOrObjectFactory.getOrCreateJSFunction(Object.assign(jsValueGetter, {
                        addSyntheticModule: function(moduleName: string, jso: any) {
                            addSyntheticModule(moduleName, jso);
                        },

                        getModuleExecutor: function () {
                            const puerRequire = initRequire();
        
                            return function (fileName: string) {
                                if (['puerts/log.mjs', 'puerts/timer.mjs'].indexOf(fileName) != -1) {
                                    return {};
                                }
                                return puerRequire(fileName);
                            };
                        }
                    }));
                    return jsfunc.id;
                },
                Eval: function (isolate: IntPtr, codeString: CSString, path: string) {
                    if (!global.eval) {
                        throw new Error("eval is not supported");
                    }
                    try {
                        const code = UTF8ToString(codeString);
                        const result = global.eval(code);
                        // return getIntPtrManager().GetPointerForJSValue(result);
                        engine.lastReturnCSResult = result;

                        return /*FResultInfo */1024;
                    } catch (e) {
                        engine.lastException = e;
                    }
                },

                SetPushJSFunctionArgumentsCallback: function (isolate: IntPtr, callback: IntPtr, jsEnvIdx: number) {
                    engine.GetJSArgumentsCallback = callback;
                },
                ThrowException: function (isolate: IntPtr, /*byte[] */messageString: CSString) {
                    throw new Error(UTF8ToString(messageString));
                },

                InvokeJSFunction: function (_function: JSFunctionPtr, hasResult: bool) {
                    const func = jsFunctionOrObjectFactory.getJSFunctionById(_function);

                    if (func instanceof JSFunction) {
                        try {
                            engine.lastReturnCSResult = func.invoke();
                            return 1024;

                        } catch (err) {
                            func.lastException = err
                            return 0;
                        }

                    } else {
                        throw new Error('ptr is not a jsfunc');
                    }
                },
                GetFunctionLastExceptionInfo: function (_function: JSFunctionPtr, /*out int */length: number) {
                    const func = jsFunctionOrObjectFactory.getJSFunctionById(_function);
                    if (func instanceof JSFunction) {
                        return engine.JSStringToCSString(func.lastException.stack || func.lastException.message || '', length);

                    } else {
                        throw new Error('ptr is not a jsfunc');
                    }
                },
                ReleaseJSFunction: function (isolate: IntPtr, _function: JSFunctionPtr) {
                    jsFunctionOrObjectFactory.removeJSFunctionById(_function);

                },
                ReleaseJSObject: function (isolate: IntPtr, obj: JSObjectPtr) {
                    jsFunctionOrObjectFactory.removeJSObjectById(obj)

                },

                ResetResult: function (resultInfo: IntPtr) {
                    engine.lastReturnCSResult = null;
                },
                ClearModuleCache: function () { },
                CreateInspector: function (isolate: IntPtr, port: int) { },
                DestroyInspector: function (isolate: IntPtr) { },
                InspectorTick: function (isolate: IntPtr) { },
                LogicTick: function (isolate: IntPtr) { },
                SetLogCallback: function (log: IntPtr, logWarning: IntPtr, logError: IntPtr) {

                }
            }
        )
    }
}