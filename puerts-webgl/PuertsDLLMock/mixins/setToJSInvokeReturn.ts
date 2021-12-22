import { JSFunction, PuertsJSEngine } from "../library";


export default function WebGLBackendSetToJSInvokeReturnApi(engine: PuertsJSEngine) {
    return {
        ReturnClass: function (isolate: IntPtr, info: MockIntPtr, classID: int) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = engine.csharpObjectMap.classes[classID];
        },
        ReturnObject: function (isolate: IntPtr, info: MockIntPtr, classID: int, self: CSObjectID) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = engine.csharpObjectMap.findOrAddObject(self, classID);
        },
        ReturnNumber: function (isolate: IntPtr, info: MockIntPtr, number: double) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = number;
        },
        ReturnString: function (isolate: IntPtr, info: MockIntPtr, strString: CSString) {
            const str = engine.unityApi.Pointer_stringify(strString);
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = str;
        },
        ReturnBigInt: function (isolate: IntPtr, info: IntPtr, /*long */number: any) {
            throw new Error('not implemented')
        },
        ReturnBoolean: function (isolate: IntPtr, info: MockIntPtr, b: bool) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = b;
        },
        ReturnDate: function (isolate: IntPtr, info: MockIntPtr, date: double) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = new Date(date);
        },
        ReturnNull: function (isolate: IntPtr, info: MockIntPtr) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            callbackInfo.returnValue = null;
        },
        ReturnFunction: function (isolate: IntPtr, info: MockIntPtr, JSFunctionPtr: MockIntPtr) {
            var callbackInfo = engine.intPtrManager.GetCallbackInfoForMockPointer(info);
            var jsFunc = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(JSFunctionPtr)
            callbackInfo.returnValue = jsFunc._func;
        },
        ReturnJSObject: function (isolate: IntPtr, info: IntPtr, JSObject: IntPtr) {
            throw new Error('not implemented')
        },
        ReturnArrayBuffer: function (isolate: IntPtr, info: IntPtr, /*byte[] */bytes: string, Length: int) {
            throw new Error('not implemented')
        },

    }
}