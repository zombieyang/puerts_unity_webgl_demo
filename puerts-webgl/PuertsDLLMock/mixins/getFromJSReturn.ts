import { jsFunctionOrObjectFactory, PuertsJSEngine, Ref } from "../library";

export default function WebGLBackendGetFromJSReturnAPI(engine: PuertsJSEngine) {
    return {
        GetNumberFromResult: function (resultInfo: IntPtr) {
            return engine.lastReturnCSResult;

        },
        GetDateFromResult: function (resultInfo: IntPtr) {
            return engine.lastReturnCSResult.getTime();

        },
        GetStringFromResult: function (resultInfo: IntPtr, /*out int */len: any) {
            return engine.JSStringToCSString(engine.lastReturnCSResult)

        },
        GetBooleanFromResult: function (resultInfo: IntPtr) {
            return engine.lastReturnCSResult;

        },
        ResultIsBigInt: function (resultInfo: IntPtr) {
            throw new Error('not implemented')

        },
        GetBigIntFromResult: function (resultInfo: IntPtr) {
            throw new Error('not implemented')

        },
        GetObjectFromResult: function (resultInfo: IntPtr) {
            throw new Error('not implemented')

        },
        GetTypeIdFromResult: function (resultInfo: IntPtr) {
            throw new Error('not implemented')

        },
        GetFunctionFromResult: function (resultInfo: IntPtr) {
            // resultInfo在webgl模式下固定为1024
            var jsfunc = jsFunctionOrObjectFactory.getOrCreateJSFunction(engine.lastReturnCSResult);
            return engine.intPtrManager.GetMockPointerForJSValue(jsfunc);
        },
        GetJSObjectFromResult: function (resultInfo: IntPtr) {
            throw new Error('not implemented')

        },
        GetArrayBufferFromResult: function (resultInfo: IntPtr, /*out int */length: any) {
            throw new Error('not implemented')

        },
    }
}