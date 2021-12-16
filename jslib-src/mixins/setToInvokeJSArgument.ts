import { JSFunction, PuertsJSEngine } from "../library";


export default function WebGLBackendSetToInvokeJSArgumentApi(engine: PuertsJSEngine) {
    return {
    
        //begin cs call js
        PushNullForJSFunction: function (_function: MockIntPtr) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(null);

        },
        PushDateForJSFunction: function (_function: MockIntPtr, dateValue: double) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(new Date(dateValue));

        },
        PushBooleanForJSFunction: function (_function: MockIntPtr, b: bool) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(b);

        },
        PushBigIntForJSFunction: function (_function: MockIntPtr, /*long */l: any) {
            throw new Error('not implemented')

        },
        PushStringForJSFunction: function (_function: MockIntPtr, strString: CSString) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(engine.unityApi.Pointer_stringify(strString));

        },
        PushNumberForJSFunction: function (_function: MockIntPtr, d: double) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(d);

        },
        PushObjectForJSFunction: function (_function: MockIntPtr, classID: int, objectID: CSObjectID) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(engine.csharpObjectMap.findOrAddObject(objectID, classID));
        },
        PushJSFunctionForJSFunction: function (_function: MockIntPtr, JSFunction: MockIntPtr) {
            const func = engine.intPtrManager.GetJSValueForMockPointer<JSFunction>(_function);
            func.args.push(engine.intPtrManager.GetJSValueForMockPointer(JSFunction));

        },
        PushJSObjectForJSFunction: function (_function: MockIntPtr, JSObject: IntPtr) {
            throw new Error('not implemented')

        },
        PushArrayBufferForJSFunction: function (_function: MockIntPtr, /*byte[] */bytes: string, length: int) {
            throw new Error('not implemented')

        }

    }
}