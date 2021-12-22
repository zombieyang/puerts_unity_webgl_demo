import { JSFunction, jsFunctionOrObjectFactory, PuertsJSEngine, Ref } from "../library";

export default function WebGLBackendGetFromJSArgumentAPI(engine: PuertsJSEngine) {
    return {
        GetNumberFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            return engine.intPtrManager.GetCallbackInfoArgForMockPointer(value);
        },
        GetDateFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            return (engine.intPtrManager.GetCallbackInfoArgForMockPointer(value) as Date).getTime();
        },
        GetStringFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            var returnStr = engine.intPtrManager.GetCallbackInfoArgForMockPointer<string>(value);
            return engine.JSStringToCSString(returnStr);
        },
        GetBooleanFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            return engine.intPtrManager.GetCallbackInfoArgForMockPointer(value);
        },
        ValueIsBigInt: function (isolate: IntPtr, value: IntPtr, isByRef: bool) {
            throw new Error('not implemented')
        },
        GetBigIntFromValue: function (isolate: IntPtr, value: IntPtr, isByRef: bool) {
            throw new Error('not implemented')
        },
        GetObjectFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            var nativeObject = engine.intPtrManager.GetCallbackInfoArgForMockPointer(value);
            return engine.csharpObjectMap.getCSObjectIDFromObject(nativeObject);
        },
        GetFunctionFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            var func = engine.intPtrManager.GetCallbackInfoArgForMockPointer<(...args: any[]) => any>(value);
            var jsfunc = jsFunctionOrObjectFactory.getOrCreateJSFunction(func);
            return engine.intPtrManager.GetMockPointerForJSValue(jsfunc);
        },
        GetJSObjectFromValue: function (isolate: IntPtr, value: IntPtr, isByRef: bool) {
            throw new Error('not implemented')
        },
        GetArrayBufferFromValue: function (isolate: IntPtr, value: IntPtr, /*out int */length: any, isOut: bool) {
            throw new Error('not implemented')
        },


        GetArgumentType: function (isolate: IntPtr, info: MockIntPtr, index: int, isByRef: bool) {
            var value = engine.intPtrManager.GetCallbackInfoForMockPointer(info).args[index];
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
        /**
         * 为c#侧提供一个获取callbackinfo里jsvalue的intptr的接口
         * 并不是得的到这个argument的值
         */
        GetArgumentValue/*inCallbackInfo*/: function (infoptr: MockIntPtr, index: int) {
            // var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            // return engine.intPtrManager.GetMockPointerForJSValue(callbackInfo.args[index]);
            return infoptr | index;
        },
        GetJsValueType: function (isolate: IntPtr, val: MockIntPtr, isByRef: bool) {
            // public enum JsValueType
            // {
            //     NullOrUndefined = 1,
            //     BigInt = 2,
            //     Number = 4,
            //     String = 8,
            //     Boolean = 16,
            //     NativeObject = 32,
            //     JsObject = 64,
            //     Array = 128,
            //     Function = 256,
            //     Date = 512,
            //     ArrayBuffer = 1024,
            //     Unknow = 2048,
            //     Any = NullOrUndefined | BigInt | Number | String | Boolean | NativeObject | Array | Function | Date | ArrayBuffer,
            // };
            var value: any = engine.intPtrManager.GetCallbackInfoArgForMockPointer(val);
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
        GetTypeIdFromValue: function (isolate: IntPtr, value: MockIntPtr, isByRef: bool) {
            var obj = engine.intPtrManager.GetCallbackInfoArgForMockPointer(value)
            var typeid = 0;
            if (typeof obj == 'function') {
                typeid = engine.csharpObjectMap.classIDWeakMap.get(obj);

            } else if (obj instanceof JSFunction) {
                typeid = engine.csharpObjectMap.classIDWeakMap.get(obj._func);

            } else {
                typeid = engine.csharpObjectMap.classIDWeakMap.get((obj as any).__proto__.constructor);
            }

            if (!typeid) {
                throw new Error('cannot find typeid for' + value)
            }
            return typeid
        },
    }
}