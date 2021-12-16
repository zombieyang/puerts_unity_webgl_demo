import { PuertsJSEngine, Ref } from "../library";

export default function WebGLBackendSetToJSOutArgumentAPI(engine: PuertsJSEngine) {
    return {
        SetNumberToOutValue: function (isolate: IntPtr, value: MockIntPtr, number: double) {
            var obj = engine.intPtrManager.GetJSValueForMockPointer<Ref<number>>(value);
            obj.value = number

        },
        SetDateToOutValue: function (isolate: IntPtr, value: MockIntPtr, date: double) {
            var obj = engine.intPtrManager.GetJSValueForMockPointer<Ref<Date>>(value);
            obj.value = new Date(date);
        },
        SetStringToOutValue: function (isolate: IntPtr, value: IntPtr, str: string) {


        },
        SetBooleanToOutValue: function (isolate: IntPtr, value: MockIntPtr, b: bool) {
            var obj = engine.intPtrManager.GetJSValueForMockPointer<Ref<bool>>(value);
            obj.value = b

        },
        SetBigIntToOutValue: function (isolate: IntPtr, value: IntPtr, /*long */bigInt: any) {
            throw new Error('not implemented')

        },
        SetObjectToOutValue: function (isolate: IntPtr, value: IntPtr, classId: int, ptr: IntPtr) {
            throw new Error('not implemented')

        },
        SetNullToOutValue: function (isolate: IntPtr, value: MockIntPtr) {
            var obj = engine.intPtrManager.GetJSValueForMockPointer<Ref<any>>(value);
            obj.value = null

        },
        SetArrayBufferToOutValue: function (isolate: IntPtr, value: IntPtr, /*Byte[] */bytes: any, length: int) {
            throw new Error('not implemented')

        },
    }
}