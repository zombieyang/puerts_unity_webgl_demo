export class FunctionCallbackInfo {
    args: any[]

    returnValue: any

    constructor(args: any[]) {
        this.args = args;
        this.returnValue = void 0;
    }

}

export class IntPtrManager {
    private infos: FunctionCallbackInfo[] = [new FunctionCallbackInfo([0])] // 这里原本只是个普通的0

    private values: IntPtr[] = [0, void 0]

    private valueWeakMap: WeakMap<any, IntPtr> = new WeakMap();

    // v8::CallbackInfo
    GetPointerForCallbackInfo(args: FunctionCallbackInfo): IntPtr {
        this.infos.push(args);
        return this.infos.length - 1;
    }
    GetCallbackInfoForPointer(intptr: IntPtr): FunctionCallbackInfo {
        return this.infos[intptr];
    }

    // v8::Value
    GetPointerForJSValue(args: any): IntPtr {
        if (typeof args == 'undefined') {
            return 1
        }
        var isFunctionOrObject = typeof args == 'function' || typeof args == 'object';
        if (isFunctionOrObject) {
            var id = this.valueWeakMap.get(args)
            if (id) {
                return id;
            }
        }
        this.values.push(args);
        if (isFunctionOrObject) {
            this.valueWeakMap.set(args, this.values.length - 1);
        }
        return this.values.length - 1;
    }
    GetJSValueForPointer(intptr: IntPtr) {
        return this.values[intptr];
    }
}

export class NativeObjectMap {
    public classes: { [classID: number]: any };

    private nativeObjectKV: { [objectID: number]: WeakRef<any> } = {};
    private objectIDWeakMap: WeakMap<any, number> = new WeakMap();

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