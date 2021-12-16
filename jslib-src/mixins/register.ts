import { OnFinalize, PuertsJSEngine, Ref } from "../library";

export default function WebGLBackendRegisterAPI(engine: PuertsJSEngine) {
    return {
        SetGlobalFunction: function (isolate: IntPtr, nameString: CSString, v8FunctionCallback: IntPtr, /*long */data: any) {
            const name = engine.unityApi.Pointer_stringify(nameString);
            (global as any)[name] = engine.makeV8FunctionCallbackFunction(v8FunctionCallback, data);
        },
        _RegisterClass: function (isolate: IntPtr, BaseTypeId: int, fullNameString: CSString, constructor: IntPtr, destructor: IntPtr, /*long */data: number) {
            const fullName = engine.unityApi.Pointer_stringify(fullNameString);

            var id = Object.keys(engine.csharpObjectMap.classes).length
            engine.csharpObjectMap.classes[id] = function (csObjectID: number) {
                // nativeObject的构造函数
                // 这个函数有两个调用的地方：1. js侧new一个它的时候 2. cs侧创建了一个对象要传到js侧时
                // 第一个情况，cs对象ID是callV8ConstructorCallback返回的。第二个情况，则是cs new完之后一并传给js的
                var args = Array.prototype.slice.call(arguments, 0);
                var argsIntPtr = engine.intPtrManager.GetMockPointerForCallbackInfo(args);

                // 虽然puerts内Constructor的返回值叫self，但它其实就是CS对象的一个id而已。
                csObjectID = csObjectID || engine.callV8ConstructorCallback(constructor, argsIntPtr, args.length, data);
                engine.csharpObjectMap.add(csObjectID, this);

                OnFinalize(this, csObjectID, (csObjectID)=> {
                    engine.callV8DestructorCallback(destructor || engine.generalDestructor, csObjectID, data);
                })
            }
            engine.csharpObjectMap.classIDWeakMap.set(engine.csharpObjectMap.classes[id], id);

            if (BaseTypeId > 0) {
                engine.csharpObjectMap.classes[id].prototype.__proto__ = engine.csharpObjectMap.classes[BaseTypeId].prototype
            }
            engine.csharpObjectMap.namesToClassesID[fullName] = id;

            return id;
        },
        RegisterStruct: function (isolate: IntPtr, BaseTypeId: int, fullName: string, constructor: IntPtr, destructor: IntPtr, /*long */data: number, size: int) {
        },
        RegisterFunction: function (isolate: IntPtr, classID: int, nameString: CSString, isStatic: bool, callback: IntPtr, /*long */data: number) {
            var cls = engine.csharpObjectMap.classes[classID]
            if (!cls) {
                return false;
            }
            const name = engine.unityApi.Pointer_stringify(nameString);

            var fn = engine.makeV8FunctionCallbackFunction(callback, data)
            if (isStatic) {
                cls[name] = fn

            } else {
                cls.prototype[name] = fn
            }
        },
        RegisterProperty: function (isolate: IntPtr, classID: int, nameString: CSString, isStatic: bool, getter: IntPtr, /*long */getterData: number, setter: IntPtr, /*long */setterData: number, dontDelete: bool) {
            var cls = engine.csharpObjectMap.classes[classID]
            if (!cls) {
                return false;
            }
            const name = engine.unityApi.Pointer_stringify(nameString);

            var attr: PropertyDescriptor = {};
            if (dontDelete) {
                attr.configurable = false;
            }
            attr.get = engine.makeV8FunctionCallbackFunction(getter, getterData);
            if (setter) {
                attr.set = engine.makeV8FunctionCallbackFunction(setter, setterData);
            }

            if (isStatic) {
                Object.defineProperty(cls, name, attr)

            } else {
                Object.defineProperty(cls.prototype, name, attr)
            }
        },
    }
}