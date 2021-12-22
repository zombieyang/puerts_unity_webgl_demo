import { JSFunction, global, PuertsJSEngine } from "./library";
import WebGLBackendGetFromJSArgumentAPI from "./mixins/getFromJSArgument";
import WebGLBackendGetFromJSReturnAPI from "./mixins/getFromJSReturn";
import WebGLBackendRegisterAPI from "./mixins/register";
import WebGLBackendSetToInvokeJSArgumentApi from "./mixins/setToInvokeJSArgument";
import WebGLBackendSetToJSInvokeReturnApi from "./mixins/setToJSInvokeReturn";
import WebGLBackendSetToJSOutArgumentAPI from "./mixins/setToJSOutArgument";

declare const PUERTS_JS_RESOURCES: any;
declare const wxRequire: any;

global.PuertsWebGL = {
    Init({
        Pointer_stringify, _malloc, stringToUTF8, lengthBytesUTF8, unityInstance
    }: PuertsJSEngine.UnityAPI) {
        debugger;
        const engine = new PuertsJSEngine({
            Pointer_stringify, _malloc, stringToUTF8, lengthBytesUTF8, unityInstance
        });

        global.__tgjsEvalScript = typeof eval == "undefined" ? ()=> {} : eval;
        global.__tgjsSetPromiseRejectCallback = function (callback: (...args: any[]) => any) {
            if (typeof wx != 'undefined') {
                wx.onUnhandledRejection(callback);

            } else {
                window.addEventListener("unhandledrejection", callback);
            }
        }

        const executeModuleCache: { [filename: string]: any } = {};

        global.PuertsWebGL = Object.assign(
            WebGLBackendGetFromJSArgumentAPI(engine),
            WebGLBackendGetFromJSReturnAPI(engine),
            WebGLBackendSetToInvokeJSArgumentApi(engine),
            WebGLBackendSetToJSInvokeReturnApi(engine),
            WebGLBackendSetToJSOutArgumentAPI(engine),
            WebGLBackendRegisterAPI(engine),
            {
                SetLastResult: function (res: any) {
                    engine.lastCallCSResult = res;
                },
                SetLastResultType: function (type: any) {
                    engine.lastCallCSResultType = type;
                },

                GetLibVersion: function () {
                    return 14;
                },
                GetLibBackend: function () {
                    return 0;
                },
                GetLastExceptionInfo: function (isolate: IntPtr,/* out int */strlen: any) {

                },
                LowMemoryNotification: function (isolate: IntPtr) {

                },
                SetGeneralDestructor: function (isolate: IntPtr, _generalDestructor: IntPtr) {
                    engine.generalDestructor = _generalDestructor
                },

                ExecuteFile: function (isolate: IntPtr, pathString: CSString) {
                    if (typeof wx != 'undefined') {
                        engine.lastReturnCSResult = wxRequire('puerts_minigame_js_resources/' + Pointer_stringify(pathString))

                    } else {
                        const result = { exports: {} };
                        const fileName = Pointer_stringify(pathString);
                        if (executeModuleCache[fileName]) {
                            engine.lastReturnCSResult = executeModuleCache[fileName];
                            return;
                        }
                        if (!PUERTS_JS_RESOURCES[fileName]) {
                            console.error('file not found' + fileName);
                        }
                        PUERTS_JS_RESOURCES[fileName](result.exports, global['require'], result)
                        engine.lastReturnCSResult = executeModuleCache[fileName] = result.exports;
                    }
                },
                Eval: function (isolate: IntPtr, codeString: CSString, path: string) {
                    if (!global.eval) {
                        throw new Error("eval is not supported");
                    }
                    const code = Pointer_stringify(codeString);
                    const result = global.eval(code);
                    // return getIntPtrManager().GetPointerForJSValue(result);
                    engine.lastReturnCSResult = result;
                    return /*FResultInfo */1024;
                },


                ThrowException: function (isolate: IntPtr, /*byte[] */messageString: CSString) {
                    throw new Error(Pointer_stringify(messageString));
                },

                InvokeJSFunction: function (_function: MockIntPtr, hasResult: bool) {
                    const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
                    if (func instanceof JSFunction) {
                        try {
                            engine.lastReturnCSResult = func.invoke();
                            return 1024;

                        } catch (err) {
                            console.error('InvokeJSFunction error', err);
                            func.lastExceptionInfo = err.message
                        }

                    } else {
                        throw new Error('ptr is not a jsfunc');
                    }
                },
                GetFunctionLastExceptionInfo: function (_function: MockIntPtr, /*out int */len: any) {
                    const func = engine.intPtrManager.GetJSValueForMockPointer(_function);
                    if (func instanceof JSFunction) {
                        return engine.JSStringToCSString(func.lastExceptionInfo || '');

                    } else {
                        throw new Error('ptr is not a jsfunc');
                    }

                },
                ReleaseJSFunction: function (isolate: IntPtr, _function: IntPtr) {
                    throw new Error('not implemented')

                },
                ReleaseJSObject: function (isolate: IntPtr, obj: IntPtr) {
                    throw new Error('not implemented')

                },

                //保守方案
                GetResultType: function (resultInfo: IntPtr) {
                    var value = engine.lastReturnCSResult;
                    if (typeof value == 'undefined') { return 1 }
                    if (typeof value == 'number') { return 4 }
                    if (typeof value == 'string') { return 8 }
                    if (typeof value == 'boolean') { return 16 }
                    if (typeof value == 'function') { return 256 }
                    if (value instanceof Date) { return 512 }
                    if (value instanceof Array) { return 128 }
                    if (engine.csharpObjectMap.getCSObjectIDFromObject(value)) { return 32 }
                    return 64;
                },
                ResetResult: function (resultInfo: IntPtr) {
                    engine.lastReturnCSResult = null;
                },

                CreateInspector: function (isolate: IntPtr, port: int) { },
                DestroyInspector: function (isolate: IntPtr) { },
                InspectorTick: function (isolate: IntPtr) { },
                SetLogCallback: function (log: IntPtr, logWarning: IntPtr, logError: IntPtr) {

                }
            }
        )
    }
}