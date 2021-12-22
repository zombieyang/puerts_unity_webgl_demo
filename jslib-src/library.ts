/**
 * 虚拟指针管理器
 * Intptr在c#侧原意是指针，代表一个内存的地址值。
 * 在这个PuertsDLL实现一个JS后端里
 * 必须建立这么一个数字->真正js值的对照表，以模拟这个机制。
 */
 export class IntPtrManager {
    // FunctionCallbackInfo的列表，以列表的index作为IntPtr的值
    private infos: FunctionCallbackInfo[] = [new FunctionCallbackInfo([0])] // 这里原本只是个普通的0
    // FunctionCallbackInfo用完后，就可以放入回收列表，以供下次复用
    private freeInfosIndex: MockIntPtr[] = [];

    // JSValue的列表，以列表index作为IntPtr的值
    private values: any[] = [0, void 0]
    // 记录每个JSValue的intptr
    private valueWeakMap: WeakMap<any, MockIntPtr> = new WeakMap();

    // v8::CallbackInfo
    GetMockPointerForCallbackInfo(callbackInfo: FunctionCallbackInfo): MockIntPtr {
        if (this.freeInfosIndex.length) {
            const index = this.freeInfosIndex.shift();
            this.infos[index] = callbackInfo;
            return index << 4;

        } else {
            this.infos.push(callbackInfo);
            return (this.infos.length - 1) << 4;
        }
    }
    GetCallbackInfoForMockPointer(intptr: MockIntPtr): FunctionCallbackInfo {
        return this.infos[intptr >> 4];
    }
    ReleaseCallbackInfoMockPointer(intptr: MockIntPtr) {
        const index = intptr >> 4;
        this.infos[index] = void 0;
        this.freeInfosIndex.push(index);
    }

    GetCallbackInfoArgForMockPointer<T>(ptr: MockIntPtr): T {
        const callbackInfoIndex = ptr >> 4;
        const argsIndex = ptr & 15;
        const info: FunctionCallbackInfo = this.infos[callbackInfoIndex];
        return info.args[argsIndex] as T;
    }
    // v8::Value
    GetMockPointerForJSValue(args: Function | object | undefined): MockIntPtr {
        if (typeof args == 'undefined') {
            return 1
        }
        var isFunctionOrObject = typeof args == 'function' || typeof args == 'object';
        if (isFunctionOrObject) {
            var id = this.valueWeakMap.get(args)
            if (id) {
                return id;
            }
            this.values.push(args);
            this.valueWeakMap.set(args, this.values.length - 1);
        } else {
            throw new Error("does not support to make a mockpointer for primitive value");
        }
        return this.values.length - 1;
    }
    GetJSValueForMockPointer<T>(intptr: MockIntPtr): T {
        return this.values[intptr] as T;
    }
}

export class FunctionCallbackInfo {
    args: any[]

    returnValue: any

    constructor(args: any[]) {
        this.args = args;
        this.returnValue = void 0;
    }

}

export class Ref<T> {
    public value: T
}

export class JSFunction {
    public _func: (...args: any[]) => any;

    private id: number;

    public args: any[] = [];

    public lastExceptionInfo: string = '';

    constructor(func: (...args: any[]) => any) {
        this._func = func;
        this.id = jsFunctionOrObjectFactory.regularID++;
        jsFunctionOrObjectFactory.idmap.set(func, this.id);
        jsFunctionOrObjectFactory.jsFuncOrObjectKV[this.id] = this;
    }
    public invoke() {
        var args = this.args.slice(0);
        this.args = [];
        this._func.apply(this, args);
    }
}

export class jsFunctionOrObjectFactory {
    public static regularID: number = 1;
    public static idmap = new WeakMap();
    public static jsFuncOrObjectKV: { [id: number]: JSFunction } = {};

    public static getOrCreateJSFunction(funcValue: (...args: any[]) => any) {
        if (jsFunctionOrObjectFactory.idmap.get(funcValue)) {
            return jsFunctionOrObjectFactory.jsFuncOrObjectKV[
                jsFunctionOrObjectFactory.idmap.get(funcValue)
            ];
        }
        return new JSFunction(funcValue);
    }
    public static getJSFunctionById(id: number): JSFunction {
        return jsFunctionOrObjectFactory.jsFuncOrObjectKV[id]
    }
    public static removeJSFunctionById(id: number) {
        delete jsFunctionOrObjectFactory.jsFuncOrObjectKV[id]
    }

}

export class CSharpObjectMap {
    public classes: { [classID: number]: any } = {};

    private nativeObjectKV: { [objectID: number]: WeakRef<any> } = {};
    private objectIDWeakMap: WeakMap<any, number> = new WeakMap();

    public namesToClassesID: { [name: string]: number } = {};
    public classIDWeakMap = new WeakMap();

    add(csObjectID: number, obj: any) {
        this.nativeObjectKV[csObjectID] = new WeakRef(obj);
        this.objectIDWeakMap.set(obj, csObjectID);
    }
    findOrAddObject(csObjectID: number, classID: number) {
        var ret;
        if (this.nativeObjectKV[csObjectID] && (ret = this.nativeObjectKV[csObjectID].deref())) {
            return ret;
        }
        ret = new this.classes[classID](csObjectID);
        this.add(csObjectID, ret);
        return ret;
    }
    getCSObjectIDFromObject(obj: any) {
        return this.objectIDWeakMap.get(obj);
    }
}

var destructors: { [CSObjectID: number]: (heldValue: any) => any } = {};

var registry: FinalizationRegistry<any> = null;
function init() {
    registry = new FinalizationRegistry(function (heldValue: any) {
        var callback = destructors[heldValue];
        if (!(heldValue in destructors)) {
            throw new Error("cannot find destructor for" + heldValue);
        }
        delete destructors[heldValue]
        console.log('onFinalize', heldValue)
        callback(heldValue);
    });
}
export function OnFinalize(obj: object, heldValue: any, callback: (heldValue: any) => any) {
    if (!registry) {
        init();
    }
    destructors[heldValue] = callback;
    registry.register(obj, heldValue);
}
declare let global: any;
global = global || globalThis || window;
global.global = global;
export { global };

export namespace PuertsJSEngine {
    export interface UnityAPI {
        Pointer_stringify: (strPtr: CSString) => string,
        _malloc: (size: number) => any,
        stringToUTF8: (str: string, buffer: any, size: number) => any,
        lengthBytesUTF8: (str: string) => number
    }
}

export class PuertsJSEngine {
    private _intPtrManager: IntPtrManager;
    public get intPtrManager() {
        return this._intPtrManager || (this._intPtrManager = new IntPtrManager());
    }

    public readonly csharpObjectMap: CSharpObjectMap

    public readonly unityApi: PuertsJSEngine.UnityAPI

    public lastCallCSResult: any = null;
    public lastCallCSResultType: any = null;
    public lastReturnCSResult: any = null;

    constructor(unityAPI: PuertsJSEngine.UnityAPI) {
        this.csharpObjectMap = new CSharpObjectMap();
        this.unityApi = unityAPI;
    }

    JSStringToCSString(returnStr: string) {
        var bufferSize = this.unityApi.lengthBytesUTF8(returnStr) + 1;
        var buffer = this.unityApi._malloc(bufferSize);
        this.unityApi.stringToUTF8(returnStr, buffer, bufferSize);
        return buffer;
    }

    public generalDestructor: IntPtr

    callV8FunctionCallback(functionPtr: IntPtr, selfPtr: CSObjectID, infoIntPtr: MockIntPtr, paramLen: number, data: number) {
        unityInstance.SendMessage('__PuertsBridge', 'SetInfoPtr', infoIntPtr);
        unityInstance.SendMessage('__PuertsBridge', 'SetSelfPtr', selfPtr || 0);
        unityInstance.SendMessage('__PuertsBridge', 'SetData', data);
        unityInstance.SendMessage('__PuertsBridge', 'SetParamLen', paramLen);
        unityInstance.SendMessage('__PuertsBridge', 'CallV8FunctionCallback', functionPtr);
    }
    makeV8FunctionCallbackFunction(functionPtr: IntPtr, data: number) {
        const engine = this;
        return function (...args: any[]) {
            let callbackInfo = new FunctionCallbackInfo(args);
            let callbackInfoPtr = engine.intPtrManager.GetMockPointerForCallbackInfo(callbackInfo);
            engine.callV8FunctionCallback(
                functionPtr,
                // getIntPtrManager().GetPointerForJSValue(this),
                engine.csharpObjectMap.getCSObjectIDFromObject(this),
                callbackInfoPtr,
                args.length,
                data
            )
            engine.intPtrManager.ReleaseCallbackInfoMockPointer(callbackInfoPtr);

            return callbackInfo.returnValue;
        }
    }
    callV8ConstructorCallback(functionPtr: IntPtr, infoIntPtr: MockIntPtr, paramLen: number, data: number) {
        unityInstance.SendMessage('__PuertsBridge', 'SetInfoPtr', infoIntPtr);
        unityInstance.SendMessage('__PuertsBridge', 'SetData', data);
        unityInstance.SendMessage('__PuertsBridge', 'SetParamLen', paramLen);
        unityInstance.SendMessage('__PuertsBridge', 'CallV8ConstructorCallback', functionPtr);
        return this.getLastResult();
    }
    callV8DestructorCallback(functionPtr: IntPtr, selfPtr: IntPtr, data: number) {
        // 虽然这里看起来像是this指针，但它实际上是CS里对象池的一个id
        unityInstance.SendMessage('__PuertsBridge', 'SetSelfPtr', selfPtr);
        unityInstance.SendMessage('__PuertsBridge', 'SetData', data);
        unityInstance.SendMessage('__PuertsBridge', 'callV8DestructorCallback', functionPtr);
    }

    getLastResult() {
        return this.lastCallCSResult
    }
}