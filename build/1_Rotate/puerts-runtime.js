/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./output/library.js":
/*!***************************!*\
  !*** ./output/library.js ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setOutValue8 = exports.setOutValue32 = exports.makeBigInt = exports.GetType = exports.PuertsJSEngine = exports.OnFinalize = exports.createWeakRef = exports.global = exports.CSharpObjectMap = exports.jsFunctionOrObjectFactory = exports.JSObject = exports.JSFunction = exports.Ref = exports.FunctionCallbackInfoPtrManager = exports.FunctionCallbackInfo = void 0;
/**
 * 一次函数调用的info
 * 对应v8::FunctionCallbackInfo
 */
class FunctionCallbackInfo {
    args;
    returnValue;
    constructor(args) {
        this.args = args;
    }
    recycle() {
        this.args = null;
        this.returnValue = void 0;
    }
}
exports.FunctionCallbackInfo = FunctionCallbackInfo;
/**
 * 把FunctionCallbackInfo以及其参数转化为c#可用的intptr
 */
class FunctionCallbackInfoPtrManager {
    // FunctionCallbackInfo的列表，以列表的index作为IntPtr的值
    static infos = [new FunctionCallbackInfo([0])]; // 这里原本只是个普通的0
    // FunctionCallbackInfo用完后，就可以放入回收列表，以供下次复用
    static freeInfosIndex = [];
    /**
     * intptr的格式为id左移四位
     *
     * 右侧四位就是为了放下参数的序号，用于表示callbackinfo参数的intptr
     */
    static GetMockPointer(args) {
        let index;
        index = this.freeInfosIndex.pop();
        // index最小为1
        if (index) {
            this.infos[index].args = args;
        }
        else {
            index = this.infos.push(new FunctionCallbackInfo(args)) - 1;
        }
        return index << 4;
    }
    static GetByMockPointer(intptr) {
        return this.infos[intptr >> 4];
    }
    static GetReturnValueAndRecycle(intptr) {
        const index = intptr >> 4;
        this.freeInfosIndex.push(index);
        let info = this.infos[index];
        let ret = info.returnValue;
        info.recycle();
        return ret;
    }
    static ReleaseByMockIntPtr(intptr) {
        const index = intptr >> 4;
        this.infos[index].recycle();
        this.freeInfosIndex.push(index);
    }
    static GetArgsByMockIntPtr(ptr) {
        const callbackInfoIndex = ptr >> 4;
        const argsIndex = ptr & 15;
        const info = this.infos[callbackInfoIndex];
        return info.args[argsIndex];
    }
}
exports.FunctionCallbackInfoPtrManager = FunctionCallbackInfoPtrManager;
class Ref {
    value;
}
exports.Ref = Ref;
/**
 * 代表一个JSFunction
 */
class JSFunction {
    _func;
    id;
    args = [];
    lastException = null;
    constructor(id, func) {
        this._func = func;
        this.id = id;
    }
    invoke() {
        var args = [...this.args];
        this.args.length = 0;
        return this._func.apply(this, args);
    }
}
exports.JSFunction = JSFunction;
/**
 * 代表一个JSObject
 */
class JSObject {
    _obj;
    id;
    constructor(id, obj) {
        this._obj = obj;
        this.id = id;
    }
    getObject() {
        return this._obj;
    }
}
exports.JSObject = JSObject;
class jsFunctionOrObjectFactory {
    static regularID = 1;
    static idMap = new WeakMap();
    static jsFuncOrObjectKV = {};
    static getOrCreateJSFunction(funcValue) {
        let id = jsFunctionOrObjectFactory.idMap.get(funcValue);
        if (id) {
            return jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
        }
        id = jsFunctionOrObjectFactory.regularID++;
        const func = new JSFunction(id, funcValue);
        jsFunctionOrObjectFactory.idMap.set(funcValue, id);
        jsFunctionOrObjectFactory.jsFuncOrObjectKV[id] = func;
        return func;
    }
    static getOrCreateJSObject(obj) {
        let id = jsFunctionOrObjectFactory.idMap.get(obj);
        if (id) {
            return jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
        }
        id = jsFunctionOrObjectFactory.regularID++;
        const jsObject = new JSObject(id, obj);
        jsFunctionOrObjectFactory.idMap.set(obj, id);
        jsFunctionOrObjectFactory.jsFuncOrObjectKV[id] = jsObject;
        return jsObject;
    }
    static getJSObjectById(id) {
        return jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
    }
    static removeJSObjectById(id) {
        const jsObject = jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
        jsFunctionOrObjectFactory.idMap.delete(jsObject.getObject());
        delete jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
    }
    static getJSFunctionById(id) {
        return jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
    }
    static removeJSFunctionById(id) {
        const jsFunc = jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
        jsFunctionOrObjectFactory.idMap.delete(jsFunc._func);
        delete jsFunctionOrObjectFactory.jsFuncOrObjectKV[id];
    }
}
exports.jsFunctionOrObjectFactory = jsFunctionOrObjectFactory;
/**
 * CSharp对象记录表，记录所有CSharp对象并分配id
 * 和puerts.dll所做的一样
 */
class CSharpObjectMap {
    classes = [null];
    nativeObjectKV = new Map();
    // private nativeObjectKV: { [objectID: CSIdentifier]: WeakRef<any> } = {};
    // private csIDWeakMap: WeakMap<any, CSIdentifier> = new WeakMap();
    namesToClassesID = {};
    classIDWeakMap = new WeakMap();
    add(csID, obj) {
        // this.nativeObjectKV[csID] = createWeakRef(obj);
        // this.csIDWeakMap.set(obj, csID);
        this.nativeObjectKV.set(csID, createWeakRef(obj));
        Object.defineProperty(obj, '_puerts_csid_', {
            value: csID
        });
    }
    remove(csID) {
        // delete this.nativeObjectKV[csID];
        this.nativeObjectKV.delete(csID);
    }
    findOrAddObject(csID, classID) {
        let ret = this.nativeObjectKV.get(csID);
        // let ret = this.nativeObjectKV[csID];
        if (ret && (ret = ret.deref())) {
            return ret;
        }
        ret = this.classes[classID].createFromCS(csID);
        // this.add(csID, ret); 构造函数里负责调用
        return ret;
    }
    getCSIdentifierFromObject(obj) {
        // return this.csIDWeakMap.get(obj);
        return obj._puerts_csid_;
    }
}
exports.CSharpObjectMap = CSharpObjectMap;
;
var destructors = {};
exports.global = __webpack_require__.g = __webpack_require__.g || globalThis || window;
__webpack_require__.g.global = __webpack_require__.g;
const createWeakRef = (function () {
    if (typeof WeakRef == 'undefined') {
        if (typeof WXWeakRef == 'undefined') {
            console.error("WeakRef is not defined. maybe you should use newer environment");
            return function (obj) {
                return { deref() { return obj; } };
            };
        }
        console.warn("using WXWeakRef");
        return function (obj) {
            return new WXWeakRef(obj);
        };
    }
    return function (obj) {
        return new WeakRef(obj);
    };
})();
exports.createWeakRef = createWeakRef;
class FinalizationRegistryMock {
    _handler;
    refs = [];
    helds = [];
    availableIndex = [];
    constructor(handler) {
        console.warn("FinalizationRegister is not defined. using FinalizationRegistryMock");
        __webpack_require__.g._puerts_registry = this;
        this._handler = handler;
    }
    register(obj, heldValue) {
        if (this.availableIndex.length) {
            const index = this.availableIndex.pop();
            this.refs[index] = createWeakRef(obj);
            this.helds[index] = heldValue;
        }
        else {
            this.refs.push(createWeakRef(obj));
            this.helds.push(heldValue);
        }
    }
    /**
     * 清除可能已经失效的WeakRef
     */
    iteratePosition = 0;
    cleanup(part = 1) {
        const stepCount = this.refs.length / part;
        let i = this.iteratePosition;
        for (let currentStep = 0; i < this.refs.length && currentStep < stepCount; i = (i == this.refs.length - 1 ? 0 : i + 1), currentStep++) {
            if (this.refs[i] == null) {
                continue;
            }
            if (!this.refs[i].deref()) {
                // 目前没有内存整理能力，如果游戏中期ref很多但后期少了，这里就会白费遍历次数
                // 但遍历也只是一句==和continue，浪费影响不大
                this.availableIndex.push(i);
                this.refs[i] = null;
                try {
                    this._handler(this.helds[i]);
                }
                catch (e) {
                    console.error(e);
                }
            }
        }
        this.iteratePosition = i;
    }
}
var registry = null;
function init() {
    registry = new (typeof FinalizationRegistry == 'undefined' ? FinalizationRegistryMock : FinalizationRegistry)(function (heldValue) {
        var callback = destructors[heldValue];
        if (!callback) {
            throw new Error("cannot find destructor for " + heldValue);
        }
        if (--callback.ref == 0) {
            delete destructors[heldValue];
            callback(heldValue);
        }
    });
}
function OnFinalize(obj, heldValue, callback) {
    if (!registry) {
        init();
    }
    let originCallback = destructors[heldValue];
    if (originCallback) {
        // WeakRef内容释放时机可能比finalizationRegistry的触发更早，前面如果发现weakRef为空会重新创建对象
        // 但之前对象的finalizationRegistry最终又肯定会触发。
        // 所以如果遇到这个情况，需要给destructor加计数
        ++originCallback.ref;
    }
    else {
        callback.ref = 1;
        destructors[heldValue] = callback;
    }
    registry.register(obj, heldValue);
}
exports.OnFinalize = OnFinalize;
class PuertsJSEngine {
    csharpObjectMap;
    unityApi;
    lastReturnCSResult = null;
    lastException = null;
    // 这四个是Puerts.WebGL里用于wasm通信的的CSharp Callback函数指针。
    callV8Function;
    callV8Constructor;
    callV8Destructor;
    callJSArgumentsGetter;
    // 这两个是Puerts用的的真正的CSharp函数指针
    GetJSArgumentsCallback;
    generalDestructor;
    constructor(ctorParam) {
        this.csharpObjectMap = new CSharpObjectMap();
        const { UTF8ToString, _malloc, _memset, _memcpy, _free, stringToUTF8, lengthBytesUTF8, unityInstance } = ctorParam;
        this.unityApi = {
            UTF8ToString,
            _malloc,
            _memset,
            _memcpy,
            _free,
            stringToUTF8,
            lengthBytesUTF8,
            dynCall_iiiii: unityInstance.dynCall_iiiii.bind(unityInstance),
            dynCall_viii: unityInstance.dynCall_viii.bind(unityInstance),
            dynCall_viiiii: unityInstance.dynCall_viiiii.bind(unityInstance),
            HEAP32: null,
            HEAP8: null
        };
        Object.defineProperty(this.unityApi, 'HEAP32', {
            get: function () {
                return unityInstance.HEAP32;
            }
        });
        Object.defineProperty(this.unityApi, 'HEAP8', {
            get: function () {
                return unityInstance.HEAP8;
            }
        });
        __webpack_require__.g.__tgjsEvalScript = typeof eval == "undefined" ? () => { } : eval;
        __webpack_require__.g.__tgjsSetPromiseRejectCallback = function (callback) {
            if (typeof wx != 'undefined') {
                wx.onUnhandledRejection(callback);
            }
            else {
                window.addEventListener("unhandledrejection", callback);
            }
        };
        __webpack_require__.g.__puertsGetLastException = () => {
            return this.lastException;
        };
    }
    JSStringToCSString(returnStr, /** out int */ length) {
        if (returnStr === null || returnStr === undefined) {
            return 0;
        }
        var byteCount = this.unityApi.lengthBytesUTF8(returnStr);
        setOutValue32(this, length, byteCount);
        var buffer = this.unityApi._malloc(byteCount + 1);
        this.unityApi.stringToUTF8(returnStr, buffer, byteCount + 1);
        return buffer;
    }
    makeV8FunctionCallbackFunction(isStatic, functionPtr, data) {
        // 不能用箭头函数！此处返回的函数会放到具体的class上，this有含义。
        const engine = this;
        return function (...args) {
            let callbackInfoPtr = FunctionCallbackInfoPtrManager.GetMockPointer(args);
            engine.callV8FunctionCallback(functionPtr, 
            // getIntPtrManager().GetPointerForJSValue(this),
            isStatic ? 0 : engine.csharpObjectMap.getCSIdentifierFromObject(this), callbackInfoPtr, args.length, data);
            return FunctionCallbackInfoPtrManager.GetReturnValueAndRecycle(callbackInfoPtr);
        };
    }
    callV8FunctionCallback(functionPtr, selfPtr, infoIntPtr, paramLen, data) {
        this.unityApi.dynCall_viiiii(this.callV8Function, functionPtr, infoIntPtr, selfPtr, paramLen, data);
    }
    callV8ConstructorCallback(functionPtr, infoIntPtr, paramLen, data) {
        return this.unityApi.dynCall_iiiii(this.callV8Constructor, functionPtr, infoIntPtr, paramLen, data);
    }
    callV8DestructorCallback(functionPtr, selfPtr, data) {
        this.unityApi.dynCall_viii(this.callV8Destructor, functionPtr, selfPtr, data);
    }
    callGetJSArgumentsCallback(jsEnvIdx, jsFuncPtr) {
        this.unityApi.dynCall_viii(this.callJSArgumentsGetter, this.GetJSArgumentsCallback, jsEnvIdx, jsFuncPtr);
    }
}
exports.PuertsJSEngine = PuertsJSEngine;
function GetType(engine, value) {
    if (value === null || value === undefined) {
        return 1;
    }
    if (typeof value == 'number') {
        return 4;
    }
    if (typeof value == 'string') {
        return 8;
    }
    if (typeof value == 'boolean') {
        return 16;
    }
    if (typeof value == 'function') {
        return 256;
    }
    if (value instanceof Date) {
        return 512;
    }
    if (value instanceof Array) {
        return 128;
    }
    if (value instanceof ArrayBuffer || value instanceof Uint8Array) {
        return 1024;
    }
    if (engine.csharpObjectMap.getCSIdentifierFromObject(value)) {
        return 32;
    }
    return 64;
}
exports.GetType = GetType;
function makeBigInt(low, high) {
    return (BigInt(high >>> 0) << BigInt(32)) + BigInt(low >>> 0);
}
exports.makeBigInt = makeBigInt;
function setOutValue32(engine, valuePtr, value) {
    engine.unityApi.HEAP32[valuePtr >> 2] = value;
}
exports.setOutValue32 = setOutValue32;
function setOutValue8(engine, valuePtr, value) {
    engine.unityApi.HEAP8[valuePtr] = value;
}
exports.setOutValue8 = setOutValue8;
//# sourceMappingURL=library.js.map

/***/ }),

/***/ "./output/mixins/getFromJSArgument.js":
/*!********************************************!*\
  !*** ./output/mixins/getFromJSArgument.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * JS调用C#时，C#侧获取JS调用参数的值
 *
 * @param engine
 * @returns
 */
function WebGLBackendGetFromJSArgumentAPI(engine) {
    return {
        GetNumberFromValue: function (isolate, value, isByRef) {
            return library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
        },
        GetDateFromValue: function (isolate, value, isByRef) {
            return library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value).getTime();
        },
        GetStringFromValue: function (isolate, value, /*out int */ length, isByRef) {
            var returnStr = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            return engine.JSStringToCSString(returnStr, length);
        },
        GetBooleanFromValue: function (isolate, value, isByRef) {
            return library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
        },
        ValueIsBigInt: function (isolate, value, isByRef) {
            var bigint = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            return bigint instanceof BigInt;
        },
        GetBigIntFromValue: function (isolate, value, isByRef) {
            var bigint = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            return bigint;
        },
        GetObjectFromValue: function (isolate, value, isByRef) {
            var nativeObject = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            return engine.csharpObjectMap.getCSIdentifierFromObject(nativeObject);
        },
        GetFunctionFromValue: function (isolate, value, isByRef) {
            var func = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            var jsfunc = library_1.jsFunctionOrObjectFactory.getOrCreateJSFunction(func);
            return jsfunc.id;
        },
        GetJSObjectFromValue: function (isolate, value, isByRef) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            var jsobj = library_1.jsFunctionOrObjectFactory.getOrCreateJSObject(obj);
            return jsobj.id;
        },
        GetArrayBufferFromValue: function (isolate, value, /*out int */ length, isOut) {
            var ab = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            if (ab instanceof Uint8Array) {
                ab = ab.buffer;
            }
            var ptr = engine.unityApi._malloc(ab.byteLength);
            engine.unityApi.HEAP8.set(new Int8Array(ab), ptr);
            engine.unityApi.HEAP32[length >> 2] = ab.byteLength;
            (0, library_1.setOutValue32)(engine, length, ab.byteLength);
            return ptr;
        },
        GetArgumentType: function (isolate, info, index, isByRef) {
            var value = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info).args[index];
            return (0, library_1.GetType)(engine, value);
        },
        /**
         * 为c#侧提供一个获取callbackinfo里jsvalue的intptr的接口
         * 并不是得的到这个argument的值
         */
        GetArgumentValue /*inCallbackInfo*/: function (infoptr, index) {
            return infoptr | index;
        },
        GetJsValueType: function (isolate, val, isByRef) {
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
            var value = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(val);
            return (0, library_1.GetType)(engine, value);
        },
        GetTypeIdFromValue: function (isolate, value, isByRef) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            var typeid = 0;
            if (obj instanceof library_1.JSFunction) {
                typeid = obj._func["$cid"];
            }
            else {
                typeid = obj["$cid"];
            }
            if (!typeid) {
                throw new Error('cannot find typeid for' + value);
            }
            return typeid;
        },
    };
}
exports["default"] = WebGLBackendGetFromJSArgumentAPI;
//# sourceMappingURL=getFromJSArgument.js.map

/***/ }),

/***/ "./output/mixins/getFromJSReturn.js":
/*!******************************************!*\
  !*** ./output/mixins/getFromJSReturn.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * C#调用JS时，获取JS函数返回值
 *
 * 原有的resultInfo设计出来只是为了让多isolate时能在不同的isolate里保持不同的result
 * 在WebGL模式下没有这个烦恼，因此直接用engine的即可
 * resultInfo固定为1024
 *
 * @param engine
 * @returns
 */
function WebGLBackendGetFromJSReturnAPI(engine) {
    return {
        GetNumberFromResult: function (resultInfo) {
            return engine.lastReturnCSResult;
        },
        GetDateFromResult: function (resultInfo) {
            return engine.lastReturnCSResult.getTime();
        },
        GetStringFromResult: function (resultInfo, /*out int */ length) {
            return engine.JSStringToCSString(engine.lastReturnCSResult, length);
        },
        GetBooleanFromResult: function (resultInfo) {
            return engine.lastReturnCSResult;
        },
        ResultIsBigInt: function (resultInfo) {
            return engine.lastReturnCSResult instanceof BigInt;
        },
        GetBigIntFromResult: function (resultInfo) {
            throw new Error('not implemented');
        },
        GetObjectFromResult: function (resultInfo) {
            return engine.csharpObjectMap.getCSIdentifierFromObject(engine.lastReturnCSResult);
        },
        GetTypeIdFromResult: function (resultInfo) {
            return (0, library_1.GetType)(engine, engine.lastReturnCSResult);
        },
        GetFunctionFromResult: function (resultInfo) {
            var jsfunc = library_1.jsFunctionOrObjectFactory.getOrCreateJSFunction(engine.lastReturnCSResult);
            return jsfunc.id;
        },
        GetJSObjectFromResult: function (resultInfo) {
            var jsobj = library_1.jsFunctionOrObjectFactory.getOrCreateJSObject(engine.lastReturnCSResult);
            return jsobj.id;
        },
        GetArrayBufferFromResult: function (resultInfo, /*out int */ length) {
            var ab = engine.lastReturnCSResult;
            var ptr = engine.unityApi._malloc(ab.byteLength);
            engine.unityApi.HEAP8.set(new Int8Array(ab), ptr);
            (0, library_1.setOutValue32)(engine, length, ab.byteLength);
            return ptr;
        },
        //保守方案
        GetResultType: function (resultInfo) {
            var value = engine.lastReturnCSResult;
            return (0, library_1.GetType)(engine, value);
        },
    };
}
exports["default"] = WebGLBackendGetFromJSReturnAPI;
//# sourceMappingURL=getFromJSReturn.js.map

/***/ }),

/***/ "./output/mixins/register.js":
/*!***********************************!*\
  !*** ./output/mixins/register.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * 注册类API，如注册全局函数、注册类，以及类的属性方法等
 *
 * @param engine
 * @returns
 */
function WebGLBackendRegisterAPI(engine) {
    const returnee = {
        SetGlobalFunction: function (isolate, nameString, v8FunctionCallback, dataLow, dataHigh) {
            const name = engine.unityApi.UTF8ToString(nameString);
            library_1.global[name] = engine.makeV8FunctionCallbackFunction(true, v8FunctionCallback, dataLow);
        },
        _RegisterClass: function (isolate, BaseTypeId, fullNameString, constructor, destructor, dataLow, dataHigh, size) {
            const fullName = engine.unityApi.UTF8ToString(fullNameString);
            const csharpObjectMap = engine.csharpObjectMap;
            const id = csharpObjectMap.classes.length;
            let tempExternalCSID = 0;
            const ctor = function () {
                // 设置类型ID
                this["$cid"] = id;
                // nativeObject的构造函数
                // 构造函数有两个调用的地方：1. js侧new一个它的时候 2. cs侧创建了一个对象要传到js侧时
                // 第一个情况，cs对象ID或者是callV8ConstructorCallback返回的。
                // 第二个情况，则cs对象ID是cs new完之后一并传给js的。
                let csID = tempExternalCSID; // 如果是第二个情况，此ID由createFromCS设置
                tempExternalCSID = 0;
                if (csID === 0) {
                    const args = Array.prototype.slice.call(arguments, 0);
                    const callbackInfoPtr = library_1.FunctionCallbackInfoPtrManager.GetMockPointer(args);
                    // 虽然puerts内Constructor的返回值叫self，但它其实就是CS对象的一个id而已。
                    csID = engine.callV8ConstructorCallback(constructor, callbackInfoPtr, args.length, dataLow);
                    library_1.FunctionCallbackInfoPtrManager.ReleaseByMockIntPtr(callbackInfoPtr);
                }
                // blittable
                if (size) {
                    let csNewID = engine.unityApi._malloc(size);
                    engine.unityApi._memcpy(csNewID, csID, size);
                    csharpObjectMap.add(csNewID, this);
                    (0, library_1.OnFinalize)(this, csNewID, (csIdentifier) => {
                        csharpObjectMap.remove(csIdentifier);
                        engine.unityApi._free(csIdentifier);
                    });
                }
                else {
                    csharpObjectMap.add(csID, this);
                    (0, library_1.OnFinalize)(this, csID, (csIdentifier) => {
                        csharpObjectMap.remove(csIdentifier);
                        engine.callV8DestructorCallback(destructor || engine.generalDestructor, csIdentifier, dataLow);
                    });
                }
            };
            ctor.createFromCS = function (csID) {
                tempExternalCSID = csID;
                return new ctor();
            };
            ctor.__puertsMetadata = new Map();
            Object.defineProperty(ctor, "name", { value: fullName + "Constructor" });
            Object.defineProperty(ctor, "$cid", { value: id });
            csharpObjectMap.classes.push(ctor);
            csharpObjectMap.classIDWeakMap.set(ctor, id);
            if (BaseTypeId > 0) {
                ctor.prototype.__proto__ = csharpObjectMap.classes[BaseTypeId].prototype;
            }
            csharpObjectMap.namesToClassesID[fullName] = id;
            return id;
        },
        RegisterStruct: function (isolate, BaseTypeId, fullNameString, constructor, destructor, /*long */ dataLow, dataHigh, size) {
            return returnee._RegisterClass(isolate, BaseTypeId, fullNameString, constructor, destructor, dataLow, dataHigh, size);
        },
        RegisterFunction: function (isolate, classID, nameString, isStatic, callback, /*long */ data) {
            var cls = engine.csharpObjectMap.classes[classID];
            if (!cls) {
                return false;
            }
            const name = engine.unityApi.UTF8ToString(nameString);
            var fn = engine.makeV8FunctionCallbackFunction(isStatic, callback, data);
            if (isStatic) {
                cls[name] = fn;
            }
            else {
                cls.prototype[name] = fn;
            }
        },
        RegisterProperty: function (isolate, classID, nameString, isStatic, getter, 
        /*long */ getterDataLow, 
        /*long */ getterDataHigh, setter, 
        /*long */ setterDataLow, 
        /*long */ setterDataHigh, dontDelete) {
            var cls = engine.csharpObjectMap.classes[classID];
            if (!cls) {
                return false;
            }
            const name = engine.unityApi.UTF8ToString(nameString);
            var attr = {
                configurable: !dontDelete,
                enumerable: false
            };
            attr.get = engine.makeV8FunctionCallbackFunction(isStatic, getter, getterDataLow);
            if (setter) {
                attr.set = engine.makeV8FunctionCallbackFunction(isStatic, setter, setterDataLow);
            }
            if (isStatic) {
                Object.defineProperty(cls, name, attr);
            }
            else {
                Object.defineProperty(cls.prototype, name, attr);
            }
        },
    };
    return returnee;
}
exports["default"] = WebGLBackendRegisterAPI;
//# sourceMappingURL=register.js.map

/***/ }),

/***/ "./output/mixins/setToInvokeJSArgument.js":
/*!************************************************!*\
  !*** ./output/mixins/setToInvokeJSArgument.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * C#调用JS时，设置调用参数的值
 *
 * @param engine
 * @returns
 */
function WebGLBackendSetToInvokeJSArgumentApi(engine) {
    return {
        //begin cs call js
        PushNullForJSFunction: function (_function) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(null);
        },
        PushDateForJSFunction: function (_function, dateValue) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(new Date(dateValue));
        },
        PushBooleanForJSFunction: function (_function, b) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(b);
        },
        PushBigIntForJSFunction: function (_function, /*long */ longlow, longhigh) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push((0, library_1.makeBigInt)(longlow, longhigh));
        },
        PushStringForJSFunction: function (_function, strString) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(engine.unityApi.UTF8ToString(strString));
        },
        PushNumberForJSFunction: function (_function, d) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(d);
        },
        PushObjectForJSFunction: function (_function, classID, objectID) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(engine.csharpObjectMap.findOrAddObject(objectID, classID));
        },
        PushJSFunctionForJSFunction: function (_function, JSFunction) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(library_1.jsFunctionOrObjectFactory.getJSFunctionById(JSFunction)._func);
        },
        PushJSObjectForJSFunction: function (_function, JSObject) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(library_1.jsFunctionOrObjectFactory.getJSObjectById(JSObject).getObject());
        },
        PushArrayBufferForJSFunction: function (_function, /*byte[] */ bytes, length) {
            const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
            func.args.push(new Uint8Array(engine.unityApi.HEAP8.buffer, bytes, length));
        }
    };
}
exports["default"] = WebGLBackendSetToInvokeJSArgumentApi;
//# sourceMappingURL=setToInvokeJSArgument.js.map

/***/ }),

/***/ "./output/mixins/setToJSInvokeReturn.js":
/*!**********************************************!*\
  !*** ./output/mixins/setToJSInvokeReturn.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * JS调用C#时，C#设置返回到JS的值
 *
 * @param engine
 * @returns
 */
function WebGLBackendSetToJSInvokeReturnApi(engine) {
    return {
        ReturnClass: function (isolate, info, classID) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = engine.csharpObjectMap.classes[classID];
        },
        ReturnObject: function (isolate, info, classID, self) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = engine.csharpObjectMap.findOrAddObject(self, classID);
        },
        ReturnNumber: function (isolate, info, number) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = number;
        },
        ReturnString: function (isolate, info, strString) {
            const str = engine.unityApi.UTF8ToString(strString);
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = str;
        },
        ReturnBigInt: function (isolate, info, longLow, longHigh) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = (0, library_1.makeBigInt)(longLow, longHigh);
        },
        ReturnBoolean: function (isolate, info, b) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = !!b; // 传过来的是1和0
        },
        ReturnDate: function (isolate, info, date) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = new Date(date);
        },
        ReturnNull: function (isolate, info) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = null;
        },
        ReturnFunction: function (isolate, info, JSFunctionPtr) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            const jsFunc = library_1.jsFunctionOrObjectFactory.getJSFunctionById(JSFunctionPtr);
            callbackInfo.returnValue = jsFunc._func;
        },
        ReturnJSObject: function (isolate, info, JSObjectPtr) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            const jsObject = library_1.jsFunctionOrObjectFactory.getJSObjectById(JSObjectPtr);
            callbackInfo.returnValue = jsObject.getObject();
        },
        ReturnCSharpFunctionCallback: function (isolate, info, v8FunctionCallback, 
        /*long */ pointerLow, 
        /*long */ pointerHigh) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = engine.makeV8FunctionCallbackFunction(false, v8FunctionCallback, pointerLow);
        },
        ReturnArrayBuffer: function (isolate, info, /*byte[] */ bytes, Length) {
            var callbackInfo = library_1.FunctionCallbackInfoPtrManager.GetByMockPointer(info);
            callbackInfo.returnValue = new Uint8Array(engine.unityApi.HEAP8.buffer, bytes, Length);
        },
    };
}
exports["default"] = WebGLBackendSetToJSInvokeReturnApi;
//# sourceMappingURL=setToJSInvokeReturn.js.map

/***/ }),

/***/ "./output/mixins/setToJSOutArgument.js":
/*!*********************************************!*\
  !*** ./output/mixins/setToJSOutArgument.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const library_1 = __webpack_require__(/*! ../library */ "./output/library.js");
/**
 * mixin
 * JS调用C#时，C#侧设置out参数值
 *
 * @param engine
 * @returns
 */
function WebGLBackendSetToJSOutArgumentAPI(engine) {
    return {
        SetNumberToOutValue: function (isolate, value, number) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = number;
        },
        SetDateToOutValue: function (isolate, value, date) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = new Date(date);
        },
        SetStringToOutValue: function (isolate, value, strString) {
            const str = engine.unityApi.UTF8ToString(strString);
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = str;
        },
        SetBooleanToOutValue: function (isolate, value, b) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = !!b; // 传过来的是1和0
        },
        SetBigIntToOutValue: function (isolate, value, /*long */ bigInt) {
            throw new Error('not implemented');
        },
        SetObjectToOutValue: function (isolate, value, classID, self) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = engine.csharpObjectMap.findOrAddObject(self, classID);
        },
        SetNullToOutValue: function (isolate, value) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = null; // 传过来的是1和0
        },
        SetArrayBufferToOutValue: function (isolate, value, /*Byte[] */ bytes, Length) {
            var obj = library_1.FunctionCallbackInfoPtrManager.GetArgsByMockIntPtr(value);
            obj.value = new Uint8Array(engine.unityApi.HEAP8.buffer, bytes, Length);
        },
    };
}
exports["default"] = WebGLBackendSetToJSOutArgumentAPI;
//# sourceMappingURL=setToJSOutArgument.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./output/index.js ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
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
const library_1 = __webpack_require__(/*! ./library */ "./output/library.js");
const getFromJSArgument_1 = __webpack_require__(/*! ./mixins/getFromJSArgument */ "./output/mixins/getFromJSArgument.js");
const getFromJSReturn_1 = __webpack_require__(/*! ./mixins/getFromJSReturn */ "./output/mixins/getFromJSReturn.js");
const register_1 = __webpack_require__(/*! ./mixins/register */ "./output/mixins/register.js");
const setToInvokeJSArgument_1 = __webpack_require__(/*! ./mixins/setToInvokeJSArgument */ "./output/mixins/setToInvokeJSArgument.js");
const setToJSInvokeReturn_1 = __webpack_require__(/*! ./mixins/setToJSInvokeReturn */ "./output/mixins/setToJSInvokeReturn.js");
const setToJSOutArgument_1 = __webpack_require__(/*! ./mixins/setToJSOutArgument */ "./output/mixins/setToJSOutArgument.js");
library_1.global.wxRequire = library_1.global.require;
library_1.global.PuertsWebGL = {
    inited: false,
    debug: false,
    // puerts首次初始化时会调用这里，并把Unity的通信接口传入
    Init({ UTF8ToString, _malloc, _memset, _memcpy, _free, stringToUTF8, lengthBytesUTF8, unityInstance }) {
        const engine = new library_1.PuertsJSEngine({
            UTF8ToString, _malloc, _memset, _memcpy, _free, stringToUTF8, lengthBytesUTF8, unityInstance
        });
        const executeModuleCache = {};
        let jsEngineReturned = false;
        // PuertsDLL的所有接口实现
        library_1.global.PuertsWebGL = Object.assign(library_1.global.PuertsWebGL, (0, getFromJSArgument_1.default)(engine), (0, getFromJSReturn_1.default)(engine), (0, setToInvokeJSArgument_1.default)(engine), (0, setToJSInvokeReturn_1.default)(engine), (0, setToJSOutArgument_1.default)(engine), (0, register_1.default)(engine), {
            // bridgeLog: true,
            SetCallV8: function (callV8Function, callV8Constructor, callV8Destructor, callJSArgumentsGetter) {
                engine.callV8Function = callV8Function;
                engine.callV8Constructor = callV8Constructor;
                engine.callV8Destructor = callV8Destructor;
                engine.callJSArgumentsGetter = callJSArgumentsGetter;
            },
            GetLibVersion: function () {
                return 17;
            },
            GetApiLevel: function () {
                return 17;
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
            GetLastExceptionInfo: function (isolate, /* out int */ strlen) {
                return engine.JSStringToCSString(engine.lastException.message, strlen);
            },
            LowMemoryNotification: function (isolate) {
            },
            SetGeneralDestructor: function (isolate, _generalDestructor) {
                engine.generalDestructor = _generalDestructor;
            },
            SetModuleResolver: function () {
            },
            ExecuteModule: function (isolate, pathString, exportee) {
                try {
                    let fileName = UTF8ToString(pathString);
                    if (fileName.indexOf('log.mjs') != -1) {
                        return 1024;
                    }
                    if (typeof wx != 'undefined') {
                        const result = wxRequire('puerts_minigame_js_resources/' + fileName.replace('.mjs', '.js').replace('.cjs', '.js'));
                        if (exportee) {
                            engine.lastReturnCSResult = result[UTF8ToString(exportee)];
                        }
                        else {
                            engine.lastReturnCSResult = result;
                        }
                        return 1024;
                    }
                    else {
                        const result = { exports: {} };
                        if (executeModuleCache[fileName]) {
                            result.exports = executeModuleCache[fileName];
                        }
                        else {
                            if (!PUERTS_JS_RESOURCES[fileName]) {
                                console.error('file not found' + fileName);
                            }
                            PUERTS_JS_RESOURCES[fileName](result.exports, library_1.global['require'], result);
                            executeModuleCache[fileName] = result.exports;
                        }
                        if (exportee) {
                            engine.lastReturnCSResult = result.exports[UTF8ToString(exportee)];
                        }
                        else {
                            engine.lastReturnCSResult = result.exports;
                        }
                        return 1024;
                    }
                }
                catch (e) {
                    engine.lastException = e;
                }
            },
            Eval: function (isolate, codeString, path) {
                if (!library_1.global.eval) {
                    throw new Error("eval is not supported");
                }
                const code = UTF8ToString(codeString);
                const result = library_1.global.eval(code);
                // return getIntPtrManager().GetPointerForJSValue(result);
                engine.lastReturnCSResult = result;
                return /*FResultInfo */ 1024;
            },
            SetPushJSFunctionArgumentsCallback: function (isolate, callback, jsEnvIdx) {
                engine.GetJSArgumentsCallback = callback;
            },
            ThrowException: function (isolate, /*byte[] */ messageString) {
                throw new Error(UTF8ToString(messageString));
            },
            InvokeJSFunction: function (_function, argumentsLen, hasResult) {
                const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
                if (argumentsLen > 0) {
                    engine.callGetJSArgumentsCallback(0, _function);
                }
                if (func instanceof library_1.JSFunction) {
                    try {
                        engine.lastReturnCSResult = func.invoke();
                        return 1024;
                    }
                    catch (err) {
                        console.error('InvokeJSFunction error', err);
                        func.lastException = err;
                    }
                }
                else {
                    throw new Error('ptr is not a jsfunc');
                }
            },
            GetFunctionLastExceptionInfo: function (_function, /*out int */ length) {
                const func = library_1.jsFunctionOrObjectFactory.getJSFunctionById(_function);
                if (func instanceof library_1.JSFunction) {
                    return engine.JSStringToCSString(func.lastException.message || '', length);
                }
                else {
                    throw new Error('ptr is not a jsfunc');
                }
            },
            ReleaseJSFunction: function (isolate, _function) {
                library_1.jsFunctionOrObjectFactory.removeJSFunctionById(_function);
            },
            ReleaseJSObject: function (isolate, obj) {
                library_1.jsFunctionOrObjectFactory.removeJSObjectById(obj);
            },
            ResetResult: function (resultInfo) {
                engine.lastReturnCSResult = null;
            },
            CreateInspector: function (isolate, port) { },
            DestroyInspector: function (isolate) { },
            InspectorTick: function (isolate) { },
            LogicTick: function (isolate) { },
            SetLogCallback: function (log, logWarning, logError) {
            }
        });
    }
};
//# sourceMappingURL=index.js.map
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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YUFBYSxFQUFDO0FBQzdELGtCQUFrQixtQkFBTyxDQUFDLHVDQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxrQkFBZTtBQUNmOzs7Ozs7Ozs7O0FDMUdhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGtCQUFrQixtQkFBTyxDQUFDLHVDQUFZO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7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Li9vdXRwdXQvbWl4aW5zL2dldEZyb21KU0FyZ3VtZW50LmpzIiwid2VicGFjazovLy8uL291dHB1dC9taXhpbnMvZ2V0RnJvbUpTUmV0dXJuLmpzIiwid2VicGFjazovLy8uL291dHB1dC9taXhpbnMvcmVnaXN0ZXIuanMiLCJ3ZWJwYWNrOi8vLy4vb3V0cHV0L21peGlucy9zZXRUb0ludm9rZUpTQXJndW1lbnQuanMiLCJ3ZWJwYWNrOi8vLy4vb3V0cHV0L21peGlucy9zZXRUb0pTSW52b2tlUmV0dXJuLmpzIiwid2VicGFjazovLy8uL291dHB1dC9taXhpbnMvc2V0VG9KU091dEFyZ3VtZW50LmpzIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly8vLi9vdXRwdXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuZXhwb3J0cy5zZXRPdXRWYWx1ZTggPSBleHBvcnRzLnNldE91dFZhbHVlMzIgPSBleHBvcnRzLm1ha2VCaWdJbnQgPSBleHBvcnRzLkdldFR5cGUgPSBleHBvcnRzLlB1ZXJ0c0pTRW5naW5lID0gZXhwb3J0cy5PbkZpbmFsaXplID0gZXhwb3J0cy5jcmVhdGVXZWFrUmVmID0gZXhwb3J0cy5nbG9iYWwgPSBleHBvcnRzLkNTaGFycE9iamVjdE1hcCA9IGV4cG9ydHMuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeSA9IGV4cG9ydHMuSlNPYmplY3QgPSBleHBvcnRzLkpTRnVuY3Rpb24gPSBleHBvcnRzLlJlZiA9IGV4cG9ydHMuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyID0gZXhwb3J0cy5GdW5jdGlvbkNhbGxiYWNrSW5mbyA9IHZvaWQgMDtcclxuLyoqXHJcbiAqIOS4gOasoeWHveaVsOiwg+eUqOeahGluZm9cclxuICog5a+55bqUdjg6OkZ1bmN0aW9uQ2FsbGJhY2tJbmZvXHJcbiAqL1xyXG5jbGFzcyBGdW5jdGlvbkNhbGxiYWNrSW5mbyB7XHJcbiAgICBhcmdzO1xyXG4gICAgcmV0dXJuVmFsdWU7XHJcbiAgICBjb25zdHJ1Y3RvcihhcmdzKSB7XHJcbiAgICAgICAgdGhpcy5hcmdzID0gYXJncztcclxuICAgIH1cclxuICAgIHJlY3ljbGUoKSB7XHJcbiAgICAgICAgdGhpcy5hcmdzID0gbnVsbDtcclxuICAgICAgICB0aGlzLnJldHVyblZhbHVlID0gdm9pZCAwO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRnVuY3Rpb25DYWxsYmFja0luZm8gPSBGdW5jdGlvbkNhbGxiYWNrSW5mbztcclxuLyoqXHJcbiAqIOaKikZ1bmN0aW9uQ2FsbGJhY2tJbmZv5Lul5Y+K5YW25Y+C5pWw6L2s5YyW5Li6YyPlj6/nlKjnmoRpbnRwdHJcclxuICovXHJcbmNsYXNzIEZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlciB7XHJcbiAgICAvLyBGdW5jdGlvbkNhbGxiYWNrSW5mb+eahOWIl+ihqO+8jOS7peWIl+ihqOeahGluZGV45L2c5Li6SW50UHRy55qE5YC8XHJcbiAgICBzdGF0aWMgaW5mb3MgPSBbbmV3IEZ1bmN0aW9uQ2FsbGJhY2tJbmZvKFswXSldOyAvLyDov5nph4zljp/mnKzlj6rmmK/kuKrmma7pgJrnmoQwXHJcbiAgICAvLyBGdW5jdGlvbkNhbGxiYWNrSW5mb+eUqOWujOWQju+8jOWwseWPr+S7peaUvuWFpeWbnuaUtuWIl+ihqO+8jOS7peS+m+S4i+asoeWkjeeUqFxyXG4gICAgc3RhdGljIGZyZWVJbmZvc0luZGV4ID0gW107XHJcbiAgICAvKipcclxuICAgICAqIGludHB0cueahOagvOW8j+S4umlk5bem56e75Zub5L2NXHJcbiAgICAgKlxyXG4gICAgICog5Y+z5L6n5Zub5L2N5bCx5piv5Li65LqG5pS+5LiL5Y+C5pWw55qE5bqP5Y+377yM55So5LqO6KGo56S6Y2FsbGJhY2tpbmZv5Y+C5pWw55qEaW50cHRyXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBHZXRNb2NrUG9pbnRlcihhcmdzKSB7XHJcbiAgICAgICAgbGV0IGluZGV4O1xyXG4gICAgICAgIGluZGV4ID0gdGhpcy5mcmVlSW5mb3NJbmRleC5wb3AoKTtcclxuICAgICAgICAvLyBpbmRleOacgOWwj+S4ujFcclxuICAgICAgICBpZiAoaW5kZXgpIHtcclxuICAgICAgICAgICAgdGhpcy5pbmZvc1tpbmRleF0uYXJncyA9IGFyZ3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpbmRleCA9IHRoaXMuaW5mb3MucHVzaChuZXcgRnVuY3Rpb25DYWxsYmFja0luZm8oYXJncykpIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGluZGV4IDw8IDQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgR2V0QnlNb2NrUG9pbnRlcihpbnRwdHIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbmZvc1tpbnRwdHIgPj4gNF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgR2V0UmV0dXJuVmFsdWVBbmRSZWN5Y2xlKGludHB0cikge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gaW50cHRyID4+IDQ7XHJcbiAgICAgICAgdGhpcy5mcmVlSW5mb3NJbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICBsZXQgaW5mbyA9IHRoaXMuaW5mb3NbaW5kZXhdO1xyXG4gICAgICAgIGxldCByZXQgPSBpbmZvLnJldHVyblZhbHVlO1xyXG4gICAgICAgIGluZm8ucmVjeWNsZSgpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgUmVsZWFzZUJ5TW9ja0ludFB0cihpbnRwdHIpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IGludHB0ciA+PiA0O1xyXG4gICAgICAgIHRoaXMuaW5mb3NbaW5kZXhdLnJlY3ljbGUoKTtcclxuICAgICAgICB0aGlzLmZyZWVJbmZvc0luZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIEdldEFyZ3NCeU1vY2tJbnRQdHIocHRyKSB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2tJbmZvSW5kZXggPSBwdHIgPj4gNDtcclxuICAgICAgICBjb25zdCBhcmdzSW5kZXggPSBwdHIgJiAxNTtcclxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5pbmZvc1tjYWxsYmFja0luZm9JbmRleF07XHJcbiAgICAgICAgcmV0dXJuIGluZm8uYXJnc1thcmdzSW5kZXhdO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyID0gRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyO1xyXG5jbGFzcyBSZWYge1xyXG4gICAgdmFsdWU7XHJcbn1cclxuZXhwb3J0cy5SZWYgPSBSZWY7XHJcbi8qKlxyXG4gKiDku6PooajkuIDkuKpKU0Z1bmN0aW9uXHJcbiAqL1xyXG5jbGFzcyBKU0Z1bmN0aW9uIHtcclxuICAgIF9mdW5jO1xyXG4gICAgaWQ7XHJcbiAgICBhcmdzID0gW107XHJcbiAgICBsYXN0RXhjZXB0aW9uID0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBmdW5jKSB7XHJcbiAgICAgICAgdGhpcy5fZnVuYyA9IGZ1bmM7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgaW52b2tlKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gWy4uLnRoaXMuYXJnc107XHJcbiAgICAgICAgdGhpcy5hcmdzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Z1bmMuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5KU0Z1bmN0aW9uID0gSlNGdW5jdGlvbjtcclxuLyoqXHJcbiAqIOS7o+ihqOS4gOS4qkpTT2JqZWN0XHJcbiAqL1xyXG5jbGFzcyBKU09iamVjdCB7XHJcbiAgICBfb2JqO1xyXG4gICAgaWQ7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgb2JqKSB7XHJcbiAgICAgICAgdGhpcy5fb2JqID0gb2JqO1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgIH1cclxuICAgIGdldE9iamVjdCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fb2JqO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuSlNPYmplY3QgPSBKU09iamVjdDtcclxuY2xhc3MganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeSB7XHJcbiAgICBzdGF0aWMgcmVndWxhcklEID0gMTtcclxuICAgIHN0YXRpYyBpZE1hcCA9IG5ldyBXZWFrTWFwKCk7XHJcbiAgICBzdGF0aWMganNGdW5jT3JPYmplY3RLViA9IHt9O1xyXG4gICAgc3RhdGljIGdldE9yQ3JlYXRlSlNGdW5jdGlvbihmdW5jVmFsdWUpIHtcclxuICAgICAgICBsZXQgaWQgPSBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmlkTWFwLmdldChmdW5jVmFsdWUpO1xyXG4gICAgICAgIGlmIChpZCkge1xyXG4gICAgICAgICAgICByZXR1cm4ganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5qc0Z1bmNPck9iamVjdEtWW2lkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWQgPSBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LnJlZ3VsYXJJRCsrO1xyXG4gICAgICAgIGNvbnN0IGZ1bmMgPSBuZXcgSlNGdW5jdGlvbihpZCwgZnVuY1ZhbHVlKTtcclxuICAgICAgICBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmlkTWFwLnNldChmdW5jVmFsdWUsIGlkKTtcclxuICAgICAgICBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmpzRnVuY09yT2JqZWN0S1ZbaWRdID0gZnVuYztcclxuICAgICAgICByZXR1cm4gZnVuYztcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRPckNyZWF0ZUpTT2JqZWN0KG9iaikge1xyXG4gICAgICAgIGxldCBpZCA9IGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuaWRNYXAuZ2V0KG9iaik7XHJcbiAgICAgICAgaWYgKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmpzRnVuY09yT2JqZWN0S1ZbaWRdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZCA9IGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkucmVndWxhcklEKys7XHJcbiAgICAgICAgY29uc3QganNPYmplY3QgPSBuZXcgSlNPYmplY3QoaWQsIG9iaik7XHJcbiAgICAgICAganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5pZE1hcC5zZXQob2JqLCBpZCk7XHJcbiAgICAgICAganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5qc0Z1bmNPck9iamVjdEtWW2lkXSA9IGpzT2JqZWN0O1xyXG4gICAgICAgIHJldHVybiBqc09iamVjdDtcclxuICAgIH1cclxuICAgIHN0YXRpYyBnZXRKU09iamVjdEJ5SWQoaWQpIHtcclxuICAgICAgICByZXR1cm4ganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5qc0Z1bmNPck9iamVjdEtWW2lkXTtcclxuICAgIH1cclxuICAgIHN0YXRpYyByZW1vdmVKU09iamVjdEJ5SWQoaWQpIHtcclxuICAgICAgICBjb25zdCBqc09iamVjdCA9IGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuanNGdW5jT3JPYmplY3RLVltpZF07XHJcbiAgICAgICAganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5pZE1hcC5kZWxldGUoanNPYmplY3QuZ2V0T2JqZWN0KCkpO1xyXG4gICAgICAgIGRlbGV0ZSBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmpzRnVuY09yT2JqZWN0S1ZbaWRdO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGdldEpTRnVuY3Rpb25CeUlkKGlkKSB7XHJcbiAgICAgICAgcmV0dXJuIGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuanNGdW5jT3JPYmplY3RLVltpZF07XHJcbiAgICB9XHJcbiAgICBzdGF0aWMgcmVtb3ZlSlNGdW5jdGlvbkJ5SWQoaWQpIHtcclxuICAgICAgICBjb25zdCBqc0Z1bmMgPSBqc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmpzRnVuY09yT2JqZWN0S1ZbaWRdO1xyXG4gICAgICAgIGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuaWRNYXAuZGVsZXRlKGpzRnVuYy5fZnVuYyk7XHJcbiAgICAgICAgZGVsZXRlIGpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuanNGdW5jT3JPYmplY3RLVltpZF07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5ID0ganNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeTtcclxuLyoqXHJcbiAqIENTaGFycOWvueixoeiusOW9leihqO+8jOiusOW9leaJgOaciUNTaGFycOWvueixoeW5tuWIhumFjWlkXHJcbiAqIOWSjHB1ZXJ0cy5kbGzmiYDlgZrnmoTkuIDmoLdcclxuICovXHJcbmNsYXNzIENTaGFycE9iamVjdE1hcCB7XHJcbiAgICBjbGFzc2VzID0gW251bGxdO1xyXG4gICAgbmF0aXZlT2JqZWN0S1YgPSBuZXcgTWFwKCk7XHJcbiAgICAvLyBwcml2YXRlIG5hdGl2ZU9iamVjdEtWOiB7IFtvYmplY3RJRDogQ1NJZGVudGlmaWVyXTogV2Vha1JlZjxhbnk+IH0gPSB7fTtcclxuICAgIC8vIHByaXZhdGUgY3NJRFdlYWtNYXA6IFdlYWtNYXA8YW55LCBDU0lkZW50aWZpZXI+ID0gbmV3IFdlYWtNYXAoKTtcclxuICAgIG5hbWVzVG9DbGFzc2VzSUQgPSB7fTtcclxuICAgIGNsYXNzSURXZWFrTWFwID0gbmV3IFdlYWtNYXAoKTtcclxuICAgIGFkZChjc0lELCBvYmopIHtcclxuICAgICAgICAvLyB0aGlzLm5hdGl2ZU9iamVjdEtWW2NzSURdID0gY3JlYXRlV2Vha1JlZihvYmopO1xyXG4gICAgICAgIC8vIHRoaXMuY3NJRFdlYWtNYXAuc2V0KG9iaiwgY3NJRCk7XHJcbiAgICAgICAgdGhpcy5uYXRpdmVPYmplY3RLVi5zZXQoY3NJRCwgY3JlYXRlV2Vha1JlZihvYmopKTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCAnX3B1ZXJ0c19jc2lkXycsIHtcclxuICAgICAgICAgICAgdmFsdWU6IGNzSURcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJlbW92ZShjc0lEKSB7XHJcbiAgICAgICAgLy8gZGVsZXRlIHRoaXMubmF0aXZlT2JqZWN0S1ZbY3NJRF07XHJcbiAgICAgICAgdGhpcy5uYXRpdmVPYmplY3RLVi5kZWxldGUoY3NJRCk7XHJcbiAgICB9XHJcbiAgICBmaW5kT3JBZGRPYmplY3QoY3NJRCwgY2xhc3NJRCkge1xyXG4gICAgICAgIGxldCByZXQgPSB0aGlzLm5hdGl2ZU9iamVjdEtWLmdldChjc0lEKTtcclxuICAgICAgICAvLyBsZXQgcmV0ID0gdGhpcy5uYXRpdmVPYmplY3RLVltjc0lEXTtcclxuICAgICAgICBpZiAocmV0ICYmIChyZXQgPSByZXQuZGVyZWYoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0ID0gdGhpcy5jbGFzc2VzW2NsYXNzSURdLmNyZWF0ZUZyb21DUyhjc0lEKTtcclxuICAgICAgICAvLyB0aGlzLmFkZChjc0lELCByZXQpOyDmnoTpgKDlh73mlbDph4zotJ/otKPosIPnlKhcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgZ2V0Q1NJZGVudGlmaWVyRnJvbU9iamVjdChvYmopIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5jc0lEV2Vha01hcC5nZXQob2JqKTtcclxuICAgICAgICByZXR1cm4gb2JqLl9wdWVydHNfY3NpZF87XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5DU2hhcnBPYmplY3RNYXAgPSBDU2hhcnBPYmplY3RNYXA7XHJcbjtcclxudmFyIGRlc3RydWN0b3JzID0ge307XHJcbmV4cG9ydHMuZ2xvYmFsID0gZ2xvYmFsID0gZ2xvYmFsIHx8IGdsb2JhbFRoaXMgfHwgd2luZG93O1xyXG5nbG9iYWwuZ2xvYmFsID0gZ2xvYmFsO1xyXG5jb25zdCBjcmVhdGVXZWFrUmVmID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0eXBlb2YgV2Vha1JlZiA9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIGlmICh0eXBlb2YgV1hXZWFrUmVmID09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWFrUmVmIGlzIG5vdCBkZWZpbmVkLiBtYXliZSB5b3Ugc2hvdWxkIHVzZSBuZXdlciBlbnZpcm9ubWVudFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IGRlcmVmKCkgeyByZXR1cm4gb2JqOyB9IH07XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUud2FybihcInVzaW5nIFdYV2Vha1JlZlwiKTtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFdYV2Vha1JlZihvYmopO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iaikge1xyXG4gICAgICAgIHJldHVybiBuZXcgV2Vha1JlZihvYmopO1xyXG4gICAgfTtcclxufSkoKTtcclxuZXhwb3J0cy5jcmVhdGVXZWFrUmVmID0gY3JlYXRlV2Vha1JlZjtcclxuY2xhc3MgRmluYWxpemF0aW9uUmVnaXN0cnlNb2NrIHtcclxuICAgIF9oYW5kbGVyO1xyXG4gICAgcmVmcyA9IFtdO1xyXG4gICAgaGVsZHMgPSBbXTtcclxuICAgIGF2YWlsYWJsZUluZGV4ID0gW107XHJcbiAgICBjb25zdHJ1Y3RvcihoYW5kbGVyKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiRmluYWxpemF0aW9uUmVnaXN0ZXIgaXMgbm90IGRlZmluZWQuIHVzaW5nIEZpbmFsaXphdGlvblJlZ2lzdHJ5TW9ja1wiKTtcclxuICAgICAgICBnbG9iYWwuX3B1ZXJ0c19yZWdpc3RyeSA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faGFuZGxlciA9IGhhbmRsZXI7XHJcbiAgICB9XHJcbiAgICByZWdpc3RlcihvYmosIGhlbGRWYWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZUluZGV4Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYXZhaWxhYmxlSW5kZXgucG9wKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmc1tpbmRleF0gPSBjcmVhdGVXZWFrUmVmKG9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuaGVsZHNbaW5kZXhdID0gaGVsZFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5yZWZzLnB1c2goY3JlYXRlV2Vha1JlZihvYmopKTtcclxuICAgICAgICAgICAgdGhpcy5oZWxkcy5wdXNoKGhlbGRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmuIXpmaTlj6/og73lt7Lnu4/lpLHmlYjnmoRXZWFrUmVmXHJcbiAgICAgKi9cclxuICAgIGl0ZXJhdGVQb3NpdGlvbiA9IDA7XHJcbiAgICBjbGVhbnVwKHBhcnQgPSAxKSB7XHJcbiAgICAgICAgY29uc3Qgc3RlcENvdW50ID0gdGhpcy5yZWZzLmxlbmd0aCAvIHBhcnQ7XHJcbiAgICAgICAgbGV0IGkgPSB0aGlzLml0ZXJhdGVQb3NpdGlvbjtcclxuICAgICAgICBmb3IgKGxldCBjdXJyZW50U3RlcCA9IDA7IGkgPCB0aGlzLnJlZnMubGVuZ3RoICYmIGN1cnJlbnRTdGVwIDwgc3RlcENvdW50OyBpID0gKGkgPT0gdGhpcy5yZWZzLmxlbmd0aCAtIDEgPyAwIDogaSArIDEpLCBjdXJyZW50U3RlcCsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlZnNbaV0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlZnNbaV0uZGVyZWYoKSkge1xyXG4gICAgICAgICAgICAgICAgLy8g55uu5YmN5rKh5pyJ5YaF5a2Y5pW055CG6IO95Yqb77yM5aaC5p6c5ri45oiP5Lit5pyfcmVm5b6I5aSa5L2G5ZCO5pyf5bCR5LqG77yM6L+Z6YeM5bCx5Lya55m96LS56YGN5Y6G5qyh5pWwXHJcbiAgICAgICAgICAgICAgICAvLyDkvYbpgY3ljobkuZ/lj6rmmK/kuIDlj6U9PeWSjGNvbnRpbnVl77yM5rWq6LS55b2x5ZON5LiN5aSnXHJcbiAgICAgICAgICAgICAgICB0aGlzLmF2YWlsYWJsZUluZGV4LnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlZnNbaV0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9oYW5kbGVyKHRoaXMuaGVsZHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuaXRlcmF0ZVBvc2l0aW9uID0gaTtcclxuICAgIH1cclxufVxyXG52YXIgcmVnaXN0cnkgPSBudWxsO1xyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gICAgcmVnaXN0cnkgPSBuZXcgKHR5cGVvZiBGaW5hbGl6YXRpb25SZWdpc3RyeSA9PSAndW5kZWZpbmVkJyA/IEZpbmFsaXphdGlvblJlZ2lzdHJ5TW9jayA6IEZpbmFsaXphdGlvblJlZ2lzdHJ5KShmdW5jdGlvbiAoaGVsZFZhbHVlKSB7XHJcbiAgICAgICAgdmFyIGNhbGxiYWNrID0gZGVzdHJ1Y3RvcnNbaGVsZFZhbHVlXTtcclxuICAgICAgICBpZiAoIWNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBmaW5kIGRlc3RydWN0b3IgZm9yIFwiICsgaGVsZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKC0tY2FsbGJhY2sucmVmID09IDApIHtcclxuICAgICAgICAgICAgZGVsZXRlIGRlc3RydWN0b3JzW2hlbGRWYWx1ZV07XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGhlbGRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gT25GaW5hbGl6ZShvYmosIGhlbGRWYWx1ZSwgY2FsbGJhY2spIHtcclxuICAgIGlmICghcmVnaXN0cnkpIHtcclxuICAgICAgICBpbml0KCk7XHJcbiAgICB9XHJcbiAgICBsZXQgb3JpZ2luQ2FsbGJhY2sgPSBkZXN0cnVjdG9yc1toZWxkVmFsdWVdO1xyXG4gICAgaWYgKG9yaWdpbkNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gV2Vha1JlZuWGheWuuemHiuaUvuaXtuacuuWPr+iDveavlGZpbmFsaXphdGlvblJlZ2lzdHJ555qE6Kem5Y+R5pu05pep77yM5YmN6Z2i5aaC5p6c5Y+R546wd2Vha1JlZuS4uuepuuS8mumHjeaWsOWIm+W7uuWvueixoVxyXG4gICAgICAgIC8vIOS9huS5i+WJjeWvueixoeeahGZpbmFsaXphdGlvblJlZ2lzdHJ55pyA57uI5Y+I6IKv5a6a5Lya6Kem5Y+R44CCXHJcbiAgICAgICAgLy8g5omA5Lul5aaC5p6c6YGH5Yiw6L+Z5Liq5oOF5Ya177yM6ZyA6KaB57uZZGVzdHJ1Y3RvcuWKoOiuoeaVsFxyXG4gICAgICAgICsrb3JpZ2luQ2FsbGJhY2sucmVmO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY2FsbGJhY2sucmVmID0gMTtcclxuICAgICAgICBkZXN0cnVjdG9yc1toZWxkVmFsdWVdID0gY2FsbGJhY2s7XHJcbiAgICB9XHJcbiAgICByZWdpc3RyeS5yZWdpc3RlcihvYmosIGhlbGRWYWx1ZSk7XHJcbn1cclxuZXhwb3J0cy5PbkZpbmFsaXplID0gT25GaW5hbGl6ZTtcclxuY2xhc3MgUHVlcnRzSlNFbmdpbmUge1xyXG4gICAgY3NoYXJwT2JqZWN0TWFwO1xyXG4gICAgdW5pdHlBcGk7XHJcbiAgICBsYXN0UmV0dXJuQ1NSZXN1bHQgPSBudWxsO1xyXG4gICAgbGFzdEV4Y2VwdGlvbiA9IG51bGw7XHJcbiAgICAvLyDov5nlm5vkuKrmmK9QdWVydHMuV2ViR0zph4znlKjkuo53YXNt6YCa5L+h55qE55qEQ1NoYXJwIENhbGxiYWNr5Ye95pWw5oyH6ZKI44CCXHJcbiAgICBjYWxsVjhGdW5jdGlvbjtcclxuICAgIGNhbGxWOENvbnN0cnVjdG9yO1xyXG4gICAgY2FsbFY4RGVzdHJ1Y3RvcjtcclxuICAgIGNhbGxKU0FyZ3VtZW50c0dldHRlcjtcclxuICAgIC8vIOi/meS4pOS4quaYr1B1ZXJ0c+eUqOeahOeahOecn+ato+eahENTaGFycOWHveaVsOaMh+mSiFxyXG4gICAgR2V0SlNBcmd1bWVudHNDYWxsYmFjaztcclxuICAgIGdlbmVyYWxEZXN0cnVjdG9yO1xyXG4gICAgY29uc3RydWN0b3IoY3RvclBhcmFtKSB7XHJcbiAgICAgICAgdGhpcy5jc2hhcnBPYmplY3RNYXAgPSBuZXcgQ1NoYXJwT2JqZWN0TWFwKCk7XHJcbiAgICAgICAgY29uc3QgeyBVVEY4VG9TdHJpbmcsIF9tYWxsb2MsIF9tZW1zZXQsIF9tZW1jcHksIF9mcmVlLCBzdHJpbmdUb1VURjgsIGxlbmd0aEJ5dGVzVVRGOCwgdW5pdHlJbnN0YW5jZSB9ID0gY3RvclBhcmFtO1xyXG4gICAgICAgIHRoaXMudW5pdHlBcGkgPSB7XHJcbiAgICAgICAgICAgIFVURjhUb1N0cmluZyxcclxuICAgICAgICAgICAgX21hbGxvYyxcclxuICAgICAgICAgICAgX21lbXNldCxcclxuICAgICAgICAgICAgX21lbWNweSxcclxuICAgICAgICAgICAgX2ZyZWUsXHJcbiAgICAgICAgICAgIHN0cmluZ1RvVVRGOCxcclxuICAgICAgICAgICAgbGVuZ3RoQnl0ZXNVVEY4LFxyXG4gICAgICAgICAgICBkeW5DYWxsX2lpaWlpOiB1bml0eUluc3RhbmNlLmR5bkNhbGxfaWlpaWkuYmluZCh1bml0eUluc3RhbmNlKSxcclxuICAgICAgICAgICAgZHluQ2FsbF92aWlpOiB1bml0eUluc3RhbmNlLmR5bkNhbGxfdmlpaS5iaW5kKHVuaXR5SW5zdGFuY2UpLFxyXG4gICAgICAgICAgICBkeW5DYWxsX3ZpaWlpaTogdW5pdHlJbnN0YW5jZS5keW5DYWxsX3ZpaWlpaS5iaW5kKHVuaXR5SW5zdGFuY2UpLFxyXG4gICAgICAgICAgICBIRUFQMzI6IG51bGwsXHJcbiAgICAgICAgICAgIEhFQVA4OiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy51bml0eUFwaSwgJ0hFQVAzMicsIHtcclxuICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdW5pdHlJbnN0YW5jZS5IRUFQMzI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcy51bml0eUFwaSwgJ0hFQVA4Jywge1xyXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB1bml0eUluc3RhbmNlLkhFQVA4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZ2xvYmFsLl9fdGdqc0V2YWxTY3JpcHQgPSB0eXBlb2YgZXZhbCA9PSBcInVuZGVmaW5lZFwiID8gKCkgPT4geyB9IDogZXZhbDtcclxuICAgICAgICBnbG9iYWwuX190Z2pzU2V0UHJvbWlzZVJlamVjdENhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygd3ggIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgIHd4Lm9uVW5oYW5kbGVkUmVqZWN0aW9uKGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgZ2xvYmFsLl9fcHVlcnRzR2V0TGFzdEV4Y2VwdGlvbiA9ICgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGFzdEV4Y2VwdGlvbjtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgSlNTdHJpbmdUb0NTU3RyaW5nKHJldHVyblN0ciwgLyoqIG91dCBpbnQgKi8gbGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHJldHVyblN0ciA9PT0gbnVsbCB8fCByZXR1cm5TdHIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGJ5dGVDb3VudCA9IHRoaXMudW5pdHlBcGkubGVuZ3RoQnl0ZXNVVEY4KHJldHVyblN0cik7XHJcbiAgICAgICAgc2V0T3V0VmFsdWUzMih0aGlzLCBsZW5ndGgsIGJ5dGVDb3VudCk7XHJcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHRoaXMudW5pdHlBcGkuX21hbGxvYyhieXRlQ291bnQgKyAxKTtcclxuICAgICAgICB0aGlzLnVuaXR5QXBpLnN0cmluZ1RvVVRGOChyZXR1cm5TdHIsIGJ1ZmZlciwgYnl0ZUNvdW50ICsgMSk7XHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgIH1cclxuICAgIG1ha2VWOEZ1bmN0aW9uQ2FsbGJhY2tGdW5jdGlvbihpc1N0YXRpYywgZnVuY3Rpb25QdHIsIGRhdGEpIHtcclxuICAgICAgICAvLyDkuI3og73nlKjnrq3lpLTlh73mlbDvvIHmraTlpITov5Tlm57nmoTlh73mlbDkvJrmlL7liLDlhbfkvZPnmoRjbGFzc+S4iu+8jHRoaXPmnInlkKvkuYnjgIJcclxuICAgICAgICBjb25zdCBlbmdpbmUgPSB0aGlzO1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xyXG4gICAgICAgICAgICBsZXQgY2FsbGJhY2tJbmZvUHRyID0gRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldE1vY2tQb2ludGVyKGFyZ3MpO1xyXG4gICAgICAgICAgICBlbmdpbmUuY2FsbFY4RnVuY3Rpb25DYWxsYmFjayhmdW5jdGlvblB0ciwgXHJcbiAgICAgICAgICAgIC8vIGdldEludFB0ck1hbmFnZXIoKS5HZXRQb2ludGVyRm9ySlNWYWx1ZSh0aGlzKSxcclxuICAgICAgICAgICAgaXNTdGF0aWMgPyAwIDogZW5naW5lLmNzaGFycE9iamVjdE1hcC5nZXRDU0lkZW50aWZpZXJGcm9tT2JqZWN0KHRoaXMpLCBjYWxsYmFja0luZm9QdHIsIGFyZ3MubGVuZ3RoLCBkYXRhKTtcclxuICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRSZXR1cm5WYWx1ZUFuZFJlY3ljbGUoY2FsbGJhY2tJbmZvUHRyKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgY2FsbFY4RnVuY3Rpb25DYWxsYmFjayhmdW5jdGlvblB0ciwgc2VsZlB0ciwgaW5mb0ludFB0ciwgcGFyYW1MZW4sIGRhdGEpIHtcclxuICAgICAgICB0aGlzLnVuaXR5QXBpLmR5bkNhbGxfdmlpaWlpKHRoaXMuY2FsbFY4RnVuY3Rpb24sIGZ1bmN0aW9uUHRyLCBpbmZvSW50UHRyLCBzZWxmUHRyLCBwYXJhbUxlbiwgZGF0YSk7XHJcbiAgICB9XHJcbiAgICBjYWxsVjhDb25zdHJ1Y3RvckNhbGxiYWNrKGZ1bmN0aW9uUHRyLCBpbmZvSW50UHRyLCBwYXJhbUxlbiwgZGF0YSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnVuaXR5QXBpLmR5bkNhbGxfaWlpaWkodGhpcy5jYWxsVjhDb25zdHJ1Y3RvciwgZnVuY3Rpb25QdHIsIGluZm9JbnRQdHIsIHBhcmFtTGVuLCBkYXRhKTtcclxuICAgIH1cclxuICAgIGNhbGxWOERlc3RydWN0b3JDYWxsYmFjayhmdW5jdGlvblB0ciwgc2VsZlB0ciwgZGF0YSkge1xyXG4gICAgICAgIHRoaXMudW5pdHlBcGkuZHluQ2FsbF92aWlpKHRoaXMuY2FsbFY4RGVzdHJ1Y3RvciwgZnVuY3Rpb25QdHIsIHNlbGZQdHIsIGRhdGEpO1xyXG4gICAgfVxyXG4gICAgY2FsbEdldEpTQXJndW1lbnRzQ2FsbGJhY2soanNFbnZJZHgsIGpzRnVuY1B0cikge1xyXG4gICAgICAgIHRoaXMudW5pdHlBcGkuZHluQ2FsbF92aWlpKHRoaXMuY2FsbEpTQXJndW1lbnRzR2V0dGVyLCB0aGlzLkdldEpTQXJndW1lbnRzQ2FsbGJhY2ssIGpzRW52SWR4LCBqc0Z1bmNQdHIpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuUHVlcnRzSlNFbmdpbmUgPSBQdWVydHNKU0VuZ2luZTtcclxuZnVuY3Rpb24gR2V0VHlwZShlbmdpbmUsIHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xyXG4gICAgICAgIHJldHVybiA0O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiA4O1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICByZXR1cm4gMTY7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZXR1cm4gMjU2O1xyXG4gICAgfVxyXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xyXG4gICAgICAgIHJldHVybiA1MTI7XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIHJldHVybiAxMjg7XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciB8fCB2YWx1ZSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcclxuICAgICAgICByZXR1cm4gMTAyNDtcclxuICAgIH1cclxuICAgIGlmIChlbmdpbmUuY3NoYXJwT2JqZWN0TWFwLmdldENTSWRlbnRpZmllckZyb21PYmplY3QodmFsdWUpKSB7XHJcbiAgICAgICAgcmV0dXJuIDMyO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIDY0O1xyXG59XHJcbmV4cG9ydHMuR2V0VHlwZSA9IEdldFR5cGU7XHJcbmZ1bmN0aW9uIG1ha2VCaWdJbnQobG93LCBoaWdoKSB7XHJcbiAgICByZXR1cm4gKEJpZ0ludChoaWdoID4+PiAwKSA8PCBCaWdJbnQoMzIpKSArIEJpZ0ludChsb3cgPj4+IDApO1xyXG59XHJcbmV4cG9ydHMubWFrZUJpZ0ludCA9IG1ha2VCaWdJbnQ7XHJcbmZ1bmN0aW9uIHNldE91dFZhbHVlMzIoZW5naW5lLCB2YWx1ZVB0ciwgdmFsdWUpIHtcclxuICAgIGVuZ2luZS51bml0eUFwaS5IRUFQMzJbdmFsdWVQdHIgPj4gMl0gPSB2YWx1ZTtcclxufVxyXG5leHBvcnRzLnNldE91dFZhbHVlMzIgPSBzZXRPdXRWYWx1ZTMyO1xyXG5mdW5jdGlvbiBzZXRPdXRWYWx1ZTgoZW5naW5lLCB2YWx1ZVB0ciwgdmFsdWUpIHtcclxuICAgIGVuZ2luZS51bml0eUFwaS5IRUFQOFt2YWx1ZVB0cl0gPSB2YWx1ZTtcclxufVxyXG5leHBvcnRzLnNldE91dFZhbHVlOCA9IHNldE91dFZhbHVlODtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGlicmFyeS5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBsaWJyYXJ5XzEgPSByZXF1aXJlKFwiLi4vbGlicmFyeVwiKTtcclxuLyoqXHJcbiAqIG1peGluXHJcbiAqIEpT6LCD55SoQyPml7bvvIxDI+S+p+iOt+WPlkpT6LCD55So5Y+C5pWw55qE5YC8XHJcbiAqXHJcbiAqIEBwYXJhbSBlbmdpbmVcclxuICogQHJldHVybnNcclxuICovXHJcbmZ1bmN0aW9uIFdlYkdMQmFja2VuZEdldEZyb21KU0FyZ3VtZW50QVBJKGVuZ2luZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBHZXROdW1iZXJGcm9tVmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgaXNCeVJlZikge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldERhdGVGcm9tVmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgaXNCeVJlZikge1xyXG4gICAgICAgICAgICByZXR1cm4gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRTdHJpbmdGcm9tVmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgLypvdXQgaW50ICovIGxlbmd0aCwgaXNCeVJlZikge1xyXG4gICAgICAgICAgICB2YXIgcmV0dXJuU3RyID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5KU1N0cmluZ1RvQ1NTdHJpbmcocmV0dXJuU3RyLCBsZW5ndGgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0Qm9vbGVhbkZyb21WYWx1ZTogZnVuY3Rpb24gKGlzb2xhdGUsIHZhbHVlLCBpc0J5UmVmKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgVmFsdWVJc0JpZ0ludDogZnVuY3Rpb24gKGlzb2xhdGUsIHZhbHVlLCBpc0J5UmVmKSB7XHJcbiAgICAgICAgICAgIHZhciBiaWdpbnQgPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gYmlnaW50IGluc3RhbmNlb2YgQmlnSW50O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0QmlnSW50RnJvbVZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIGlzQnlSZWYpIHtcclxuICAgICAgICAgICAgdmFyIGJpZ2ludCA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QXJnc0J5TW9ja0ludFB0cih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBiaWdpbnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRPYmplY3RGcm9tVmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgaXNCeVJlZikge1xyXG4gICAgICAgICAgICB2YXIgbmF0aXZlT2JqZWN0ID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5jc2hhcnBPYmplY3RNYXAuZ2V0Q1NJZGVudGlmaWVyRnJvbU9iamVjdChuYXRpdmVPYmplY3QpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0RnVuY3Rpb25Gcm9tVmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgaXNCeVJlZikge1xyXG4gICAgICAgICAgICB2YXIgZnVuYyA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QXJnc0J5TW9ja0ludFB0cih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciBqc2Z1bmMgPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRPckNyZWF0ZUpTRnVuY3Rpb24oZnVuYyk7XHJcbiAgICAgICAgICAgIHJldHVybiBqc2Z1bmMuaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRKU09iamVjdEZyb21WYWx1ZTogZnVuY3Rpb24gKGlzb2xhdGUsIHZhbHVlLCBpc0J5UmVmKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIganNvYmogPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRPckNyZWF0ZUpTT2JqZWN0KG9iaik7XHJcbiAgICAgICAgICAgIHJldHVybiBqc29iai5pZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldEFycmF5QnVmZmVyRnJvbVZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIC8qb3V0IGludCAqLyBsZW5ndGgsIGlzT3V0KSB7XHJcbiAgICAgICAgICAgIHZhciBhYiA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QXJnc0J5TW9ja0ludFB0cih2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChhYiBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGFiID0gYWIuYnVmZmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwdHIgPSBlbmdpbmUudW5pdHlBcGkuX21hbGxvYyhhYi5ieXRlTGVuZ3RoKTtcclxuICAgICAgICAgICAgZW5naW5lLnVuaXR5QXBpLkhFQVA4LnNldChuZXcgSW50OEFycmF5KGFiKSwgcHRyKTtcclxuICAgICAgICAgICAgZW5naW5lLnVuaXR5QXBpLkhFQVAzMltsZW5ndGggPj4gMl0gPSBhYi5ieXRlTGVuZ3RoO1xyXG4gICAgICAgICAgICAoMCwgbGlicmFyeV8xLnNldE91dFZhbHVlMzIpKGVuZ2luZSwgbGVuZ3RoLCBhYi5ieXRlTGVuZ3RoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHB0cjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldEFyZ3VtZW50VHlwZTogZnVuY3Rpb24gKGlzb2xhdGUsIGluZm8sIGluZGV4LCBpc0J5UmVmKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QnlNb2NrUG9pbnRlcihpbmZvKS5hcmdzW2luZGV4XTtcclxuICAgICAgICAgICAgcmV0dXJuICgwLCBsaWJyYXJ5XzEuR2V0VHlwZSkoZW5naW5lLCB2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDkuLpjI+S+p+aPkOS+m+S4gOS4quiOt+WPlmNhbGxiYWNraW5mb+mHjGpzdmFsdWXnmoRpbnRwdHLnmoTmjqXlj6NcclxuICAgICAgICAgKiDlubbkuI3mmK/lvpfnmoTliLDov5nkuKphcmd1bWVudOeahOWAvFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIEdldEFyZ3VtZW50VmFsdWUgLyppbkNhbGxiYWNrSW5mbyovOiBmdW5jdGlvbiAoaW5mb3B0ciwgaW5kZXgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGluZm9wdHIgfCBpbmRleDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldEpzVmFsdWVUeXBlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsLCBpc0J5UmVmKSB7XHJcbiAgICAgICAgICAgIC8vIHB1YmxpYyBlbnVtIEpzVmFsdWVUeXBlXHJcbiAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgLy8gICAgIE51bGxPclVuZGVmaW5lZCA9IDEsXHJcbiAgICAgICAgICAgIC8vICAgICBCaWdJbnQgPSAyLFxyXG4gICAgICAgICAgICAvLyAgICAgTnVtYmVyID0gNCxcclxuICAgICAgICAgICAgLy8gICAgIFN0cmluZyA9IDgsXHJcbiAgICAgICAgICAgIC8vICAgICBCb29sZWFuID0gMTYsXHJcbiAgICAgICAgICAgIC8vICAgICBOYXRpdmVPYmplY3QgPSAzMixcclxuICAgICAgICAgICAgLy8gICAgIEpzT2JqZWN0ID0gNjQsXHJcbiAgICAgICAgICAgIC8vICAgICBBcnJheSA9IDEyOCxcclxuICAgICAgICAgICAgLy8gICAgIEZ1bmN0aW9uID0gMjU2LFxyXG4gICAgICAgICAgICAvLyAgICAgRGF0ZSA9IDUxMixcclxuICAgICAgICAgICAgLy8gICAgIEFycmF5QnVmZmVyID0gMTAyNCxcclxuICAgICAgICAgICAgLy8gICAgIFVua25vdyA9IDIwNDgsXHJcbiAgICAgICAgICAgIC8vICAgICBBbnkgPSBOdWxsT3JVbmRlZmluZWQgfCBCaWdJbnQgfCBOdW1iZXIgfCBTdHJpbmcgfCBCb29sZWFuIHwgTmF0aXZlT2JqZWN0IHwgQXJyYXkgfCBGdW5jdGlvbiB8IERhdGUgfCBBcnJheUJ1ZmZlcixcclxuICAgICAgICAgICAgLy8gfTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbCk7XHJcbiAgICAgICAgICAgIHJldHVybiAoMCwgbGlicmFyeV8xLkdldFR5cGUpKGVuZ2luZSwgdmFsdWUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0VHlwZUlkRnJvbVZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIGlzQnlSZWYpIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QXJnc0J5TW9ja0ludFB0cih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHZhciB0eXBlaWQgPSAwO1xyXG4gICAgICAgICAgICBpZiAob2JqIGluc3RhbmNlb2YgbGlicmFyeV8xLkpTRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHR5cGVpZCA9IG9iai5fZnVuY1tcIiRjaWRcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0eXBlaWQgPSBvYmpbXCIkY2lkXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdHlwZWlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Nhbm5vdCBmaW5kIHR5cGVpZCBmb3InICsgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlaWQ7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gV2ViR0xCYWNrZW5kR2V0RnJvbUpTQXJndW1lbnRBUEk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldEZyb21KU0FyZ3VtZW50LmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGxpYnJhcnlfMSA9IHJlcXVpcmUoXCIuLi9saWJyYXJ5XCIpO1xyXG4vKipcclxuICogbWl4aW5cclxuICogQyPosIPnlKhKU+aXtu+8jOiOt+WPlkpT5Ye95pWw6L+U5Zue5YC8XHJcbiAqXHJcbiAqIOWOn+acieeahHJlc3VsdEluZm/orr7orqHlh7rmnaXlj6rmmK/kuLrkuoborqnlpJppc29sYXRl5pe26IO95Zyo5LiN5ZCM55qEaXNvbGF0ZemHjOS/neaMgeS4jeWQjOeahHJlc3VsdFxyXG4gKiDlnKhXZWJHTOaooeW8j+S4i+ayoeaciei/meS4queDpuaBvO+8jOWboOatpOebtOaOpeeUqGVuZ2luZeeahOWNs+WPr1xyXG4gKiByZXN1bHRJbmZv5Zu65a6a5Li6MTAyNFxyXG4gKlxyXG4gKiBAcGFyYW0gZW5naW5lXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBXZWJHTEJhY2tlbmRHZXRGcm9tSlNSZXR1cm5BUEkoZW5naW5lKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIEdldE51bWJlckZyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0O1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0RGF0ZUZyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0LmdldFRpbWUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldFN0cmluZ0Zyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvLCAvKm91dCBpbnQgKi8gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbmdpbmUuSlNTdHJpbmdUb0NTU3RyaW5nKGVuZ2luZS5sYXN0UmV0dXJuQ1NSZXN1bHQsIGxlbmd0aCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRCb29sZWFuRnJvbVJlc3VsdDogZnVuY3Rpb24gKHJlc3VsdEluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5sYXN0UmV0dXJuQ1NSZXN1bHQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBSZXN1bHRJc0JpZ0ludDogZnVuY3Rpb24gKHJlc3VsdEluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5sYXN0UmV0dXJuQ1NSZXN1bHQgaW5zdGFuY2VvZiBCaWdJbnQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRCaWdJbnRGcm9tUmVzdWx0OiBmdW5jdGlvbiAocmVzdWx0SW5mbykge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBpbXBsZW1lbnRlZCcpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgR2V0T2JqZWN0RnJvbVJlc3VsdDogZnVuY3Rpb24gKHJlc3VsdEluZm8pIHtcclxuICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5jc2hhcnBPYmplY3RNYXAuZ2V0Q1NJZGVudGlmaWVyRnJvbU9iamVjdChlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldFR5cGVJZEZyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAoMCwgbGlicmFyeV8xLkdldFR5cGUpKGVuZ2luZSwgZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRGdW5jdGlvbkZyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvKSB7XHJcbiAgICAgICAgICAgIHZhciBqc2Z1bmMgPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRPckNyZWF0ZUpTRnVuY3Rpb24oZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBqc2Z1bmMuaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBHZXRKU09iamVjdEZyb21SZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHRJbmZvKSB7XHJcbiAgICAgICAgICAgIHZhciBqc29iaiA9IGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldE9yQ3JlYXRlSlNPYmplY3QoZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiBqc29iai5pZDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIEdldEFycmF5QnVmZmVyRnJvbVJlc3VsdDogZnVuY3Rpb24gKHJlc3VsdEluZm8sIC8qb3V0IGludCAqLyBsZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIGFiID0gZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdDtcclxuICAgICAgICAgICAgdmFyIHB0ciA9IGVuZ2luZS51bml0eUFwaS5fbWFsbG9jKGFiLmJ5dGVMZW5ndGgpO1xyXG4gICAgICAgICAgICBlbmdpbmUudW5pdHlBcGkuSEVBUDguc2V0KG5ldyBJbnQ4QXJyYXkoYWIpLCBwdHIpO1xyXG4gICAgICAgICAgICAoMCwgbGlicmFyeV8xLnNldE91dFZhbHVlMzIpKGVuZ2luZSwgbGVuZ3RoLCBhYi5ieXRlTGVuZ3RoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHB0cjtcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8v5L+d5a6I5pa55qGIXHJcbiAgICAgICAgR2V0UmVzdWx0VHlwZTogZnVuY3Rpb24gKHJlc3VsdEluZm8pIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdDtcclxuICAgICAgICAgICAgcmV0dXJuICgwLCBsaWJyYXJ5XzEuR2V0VHlwZSkoZW5naW5lLCB2YWx1ZSk7XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gV2ViR0xCYWNrZW5kR2V0RnJvbUpTUmV0dXJuQVBJO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXRGcm9tSlNSZXR1cm4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbGlicmFyeV8xID0gcmVxdWlyZShcIi4uL2xpYnJhcnlcIik7XHJcbi8qKlxyXG4gKiBtaXhpblxyXG4gKiDms6jlhoznsbtBUEnvvIzlpoLms6jlhozlhajlsYDlh73mlbDjgIHms6jlhoznsbvvvIzku6Xlj4rnsbvnmoTlsZ7mgKfmlrnms5XnrYlcclxuICpcclxuICogQHBhcmFtIGVuZ2luZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gV2ViR0xCYWNrZW5kUmVnaXN0ZXJBUEkoZW5naW5lKSB7XHJcbiAgICBjb25zdCByZXR1cm5lZSA9IHtcclxuICAgICAgICBTZXRHbG9iYWxGdW5jdGlvbjogZnVuY3Rpb24gKGlzb2xhdGUsIG5hbWVTdHJpbmcsIHY4RnVuY3Rpb25DYWxsYmFjaywgZGF0YUxvdywgZGF0YUhpZ2gpIHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGVuZ2luZS51bml0eUFwaS5VVEY4VG9TdHJpbmcobmFtZVN0cmluZyk7XHJcbiAgICAgICAgICAgIGxpYnJhcnlfMS5nbG9iYWxbbmFtZV0gPSBlbmdpbmUubWFrZVY4RnVuY3Rpb25DYWxsYmFja0Z1bmN0aW9uKHRydWUsIHY4RnVuY3Rpb25DYWxsYmFjaywgZGF0YUxvdyk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBfUmVnaXN0ZXJDbGFzczogZnVuY3Rpb24gKGlzb2xhdGUsIEJhc2VUeXBlSWQsIGZ1bGxOYW1lU3RyaW5nLCBjb25zdHJ1Y3RvciwgZGVzdHJ1Y3RvciwgZGF0YUxvdywgZGF0YUhpZ2gsIHNpemUpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBlbmdpbmUudW5pdHlBcGkuVVRGOFRvU3RyaW5nKGZ1bGxOYW1lU3RyaW5nKTtcclxuICAgICAgICAgICAgY29uc3QgY3NoYXJwT2JqZWN0TWFwID0gZW5naW5lLmNzaGFycE9iamVjdE1hcDtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSBjc2hhcnBPYmplY3RNYXAuY2xhc3Nlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wRXh0ZXJuYWxDU0lEID0gMDtcclxuICAgICAgICAgICAgY29uc3QgY3RvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIOiuvue9ruexu+Wei0lEXHJcbiAgICAgICAgICAgICAgICB0aGlzW1wiJGNpZFwiXSA9IGlkO1xyXG4gICAgICAgICAgICAgICAgLy8gbmF0aXZlT2JqZWN055qE5p6E6YCg5Ye95pWwXHJcbiAgICAgICAgICAgICAgICAvLyDmnoTpgKDlh73mlbDmnInkuKTkuKrosIPnlKjnmoTlnLDmlrnvvJoxLiBqc+S+p25ld+S4gOS4quWug+eahOaXtuWAmSAyLiBjc+S+p+WIm+W7uuS6huS4gOS4quWvueixoeimgeS8oOWIsGpz5L6n5pe2XHJcbiAgICAgICAgICAgICAgICAvLyDnrKzkuIDkuKrmg4XlhrXvvIxjc+WvueixoUlE5oiW6ICF5pivY2FsbFY4Q29uc3RydWN0b3JDYWxsYmFja+i/lOWbnueahOOAglxyXG4gICAgICAgICAgICAgICAgLy8g56ys5LqM5Liq5oOF5Ya177yM5YiZY3Plr7nosaFJROaYr2NzIG5ld+WujOS5i+WQjuS4gOW5tuS8oOe7mWpz55qE44CCXHJcbiAgICAgICAgICAgICAgICBsZXQgY3NJRCA9IHRlbXBFeHRlcm5hbENTSUQ7IC8vIOWmguaenOaYr+esrOS6jOS4quaDheWGte+8jOatpElE55SxY3JlYXRlRnJvbUNT6K6+572uXHJcbiAgICAgICAgICAgICAgICB0ZW1wRXh0ZXJuYWxDU0lEID0gMDtcclxuICAgICAgICAgICAgICAgIGlmIChjc0lEID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FsbGJhY2tJbmZvUHRyID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRNb2NrUG9pbnRlcihhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyDomb3nhLZwdWVydHPlhoVDb25zdHJ1Y3RvcueahOi/lOWbnuWAvOWPq3NlbGbvvIzkvYblroPlhbblrp7lsLHmmK9DU+WvueixoeeahOS4gOS4qmlk6ICM5bey44CCXHJcbiAgICAgICAgICAgICAgICAgICAgY3NJRCA9IGVuZ2luZS5jYWxsVjhDb25zdHJ1Y3RvckNhbGxiYWNrKGNvbnN0cnVjdG9yLCBjYWxsYmFja0luZm9QdHIsIGFyZ3MubGVuZ3RoLCBkYXRhTG93KTtcclxuICAgICAgICAgICAgICAgICAgICBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLlJlbGVhc2VCeU1vY2tJbnRQdHIoY2FsbGJhY2tJbmZvUHRyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGJsaXR0YWJsZVxyXG4gICAgICAgICAgICAgICAgaWYgKHNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY3NOZXdJRCA9IGVuZ2luZS51bml0eUFwaS5fbWFsbG9jKHNpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZ2luZS51bml0eUFwaS5fbWVtY3B5KGNzTmV3SUQsIGNzSUQsIHNpemUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNzaGFycE9iamVjdE1hcC5hZGQoY3NOZXdJRCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgKDAsIGxpYnJhcnlfMS5PbkZpbmFsaXplKSh0aGlzLCBjc05ld0lELCAoY3NJZGVudGlmaWVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNzaGFycE9iamVjdE1hcC5yZW1vdmUoY3NJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZW5naW5lLnVuaXR5QXBpLl9mcmVlKGNzSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjc2hhcnBPYmplY3RNYXAuYWRkKGNzSUQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICgwLCBsaWJyYXJ5XzEuT25GaW5hbGl6ZSkodGhpcywgY3NJRCwgKGNzSWRlbnRpZmllcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjc2hhcnBPYmplY3RNYXAucmVtb3ZlKGNzSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZS5jYWxsVjhEZXN0cnVjdG9yQ2FsbGJhY2soZGVzdHJ1Y3RvciB8fCBlbmdpbmUuZ2VuZXJhbERlc3RydWN0b3IsIGNzSWRlbnRpZmllciwgZGF0YUxvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGN0b3IuY3JlYXRlRnJvbUNTID0gZnVuY3Rpb24gKGNzSUQpIHtcclxuICAgICAgICAgICAgICAgIHRlbXBFeHRlcm5hbENTSUQgPSBjc0lEO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBjdG9yKCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGN0b3IuX19wdWVydHNNZXRhZGF0YSA9IG5ldyBNYXAoKTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IsIFwibmFtZVwiLCB7IHZhbHVlOiBmdWxsTmFtZSArIFwiQ29uc3RydWN0b3JcIiB9KTtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGN0b3IsIFwiJGNpZFwiLCB7IHZhbHVlOiBpZCB9KTtcclxuICAgICAgICAgICAgY3NoYXJwT2JqZWN0TWFwLmNsYXNzZXMucHVzaChjdG9yKTtcclxuICAgICAgICAgICAgY3NoYXJwT2JqZWN0TWFwLmNsYXNzSURXZWFrTWFwLnNldChjdG9yLCBpZCk7XHJcbiAgICAgICAgICAgIGlmIChCYXNlVHlwZUlkID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY3Rvci5wcm90b3R5cGUuX19wcm90b19fID0gY3NoYXJwT2JqZWN0TWFwLmNsYXNzZXNbQmFzZVR5cGVJZF0ucHJvdG90eXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNzaGFycE9iamVjdE1hcC5uYW1lc1RvQ2xhc3Nlc0lEW2Z1bGxOYW1lXSA9IGlkO1xyXG4gICAgICAgICAgICByZXR1cm4gaWQ7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBSZWdpc3RlclN0cnVjdDogZnVuY3Rpb24gKGlzb2xhdGUsIEJhc2VUeXBlSWQsIGZ1bGxOYW1lU3RyaW5nLCBjb25zdHJ1Y3RvciwgZGVzdHJ1Y3RvciwgLypsb25nICovIGRhdGFMb3csIGRhdGFIaWdoLCBzaXplKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZXR1cm5lZS5fUmVnaXN0ZXJDbGFzcyhpc29sYXRlLCBCYXNlVHlwZUlkLCBmdWxsTmFtZVN0cmluZywgY29uc3RydWN0b3IsIGRlc3RydWN0b3IsIGRhdGFMb3csIGRhdGFIaWdoLCBzaXplKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFJlZ2lzdGVyRnVuY3Rpb246IGZ1bmN0aW9uIChpc29sYXRlLCBjbGFzc0lELCBuYW1lU3RyaW5nLCBpc1N0YXRpYywgY2FsbGJhY2ssIC8qbG9uZyAqLyBkYXRhKSB7XHJcbiAgICAgICAgICAgIHZhciBjbHMgPSBlbmdpbmUuY3NoYXJwT2JqZWN0TWFwLmNsYXNzZXNbY2xhc3NJRF07XHJcbiAgICAgICAgICAgIGlmICghY2xzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGVuZ2luZS51bml0eUFwaS5VVEY4VG9TdHJpbmcobmFtZVN0cmluZyk7XHJcbiAgICAgICAgICAgIHZhciBmbiA9IGVuZ2luZS5tYWtlVjhGdW5jdGlvbkNhbGxiYWNrRnVuY3Rpb24oaXNTdGF0aWMsIGNhbGxiYWNrLCBkYXRhKTtcclxuICAgICAgICAgICAgaWYgKGlzU3RhdGljKSB7XHJcbiAgICAgICAgICAgICAgICBjbHNbbmFtZV0gPSBmbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNscy5wcm90b3R5cGVbbmFtZV0gPSBmbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmVnaXN0ZXJQcm9wZXJ0eTogZnVuY3Rpb24gKGlzb2xhdGUsIGNsYXNzSUQsIG5hbWVTdHJpbmcsIGlzU3RhdGljLCBnZXR0ZXIsIFxyXG4gICAgICAgIC8qbG9uZyAqLyBnZXR0ZXJEYXRhTG93LCBcclxuICAgICAgICAvKmxvbmcgKi8gZ2V0dGVyRGF0YUhpZ2gsIHNldHRlciwgXHJcbiAgICAgICAgLypsb25nICovIHNldHRlckRhdGFMb3csIFxyXG4gICAgICAgIC8qbG9uZyAqLyBzZXR0ZXJEYXRhSGlnaCwgZG9udERlbGV0ZSkge1xyXG4gICAgICAgICAgICB2YXIgY2xzID0gZW5naW5lLmNzaGFycE9iamVjdE1hcC5jbGFzc2VzW2NsYXNzSURdO1xyXG4gICAgICAgICAgICBpZiAoIWNscykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBlbmdpbmUudW5pdHlBcGkuVVRGOFRvU3RyaW5nKG5hbWVTdHJpbmcpO1xyXG4gICAgICAgICAgICB2YXIgYXR0ciA9IHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogIWRvbnREZWxldGUsXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBhdHRyLmdldCA9IGVuZ2luZS5tYWtlVjhGdW5jdGlvbkNhbGxiYWNrRnVuY3Rpb24oaXNTdGF0aWMsIGdldHRlciwgZ2V0dGVyRGF0YUxvdyk7XHJcbiAgICAgICAgICAgIGlmIChzZXR0ZXIpIHtcclxuICAgICAgICAgICAgICAgIGF0dHIuc2V0ID0gZW5naW5lLm1ha2VWOEZ1bmN0aW9uQ2FsbGJhY2tGdW5jdGlvbihpc1N0YXRpYywgc2V0dGVyLCBzZXR0ZXJEYXRhTG93KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaXNTdGF0aWMpIHtcclxuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbHMsIG5hbWUsIGF0dHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGNscy5wcm90b3R5cGUsIG5hbWUsIGF0dHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gcmV0dXJuZWU7XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gV2ViR0xCYWNrZW5kUmVnaXN0ZXJBUEk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlZ2lzdGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IGxpYnJhcnlfMSA9IHJlcXVpcmUoXCIuLi9saWJyYXJ5XCIpO1xyXG4vKipcclxuICogbWl4aW5cclxuICogQyPosIPnlKhKU+aXtu+8jOiuvue9ruiwg+eUqOWPguaVsOeahOWAvFxyXG4gKlxyXG4gKiBAcGFyYW0gZW5naW5lXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBXZWJHTEJhY2tlbmRTZXRUb0ludm9rZUpTQXJndW1lbnRBcGkoZW5naW5lKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIC8vYmVnaW4gY3MgY2FsbCBqc1xyXG4gICAgICAgIFB1c2hOdWxsRm9ySlNGdW5jdGlvbjogZnVuY3Rpb24gKF9mdW5jdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2gobnVsbCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBQdXNoRGF0ZUZvckpTRnVuY3Rpb246IGZ1bmN0aW9uIChfZnVuY3Rpb24sIGRhdGVWYWx1ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2gobmV3IERhdGUoZGF0ZVZhbHVlKSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBQdXNoQm9vbGVhbkZvckpTRnVuY3Rpb246IGZ1bmN0aW9uIChfZnVuY3Rpb24sIGIpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuYyA9IGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldEpTRnVuY3Rpb25CeUlkKF9mdW5jdGlvbik7XHJcbiAgICAgICAgICAgIGZ1bmMuYXJncy5wdXNoKGIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUHVzaEJpZ0ludEZvckpTRnVuY3Rpb246IGZ1bmN0aW9uIChfZnVuY3Rpb24sIC8qbG9uZyAqLyBsb25nbG93LCBsb25naGlnaCkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2goKDAsIGxpYnJhcnlfMS5tYWtlQmlnSW50KShsb25nbG93LCBsb25naGlnaCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUHVzaFN0cmluZ0ZvckpTRnVuY3Rpb246IGZ1bmN0aW9uIChfZnVuY3Rpb24sIHN0clN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2goZW5naW5lLnVuaXR5QXBpLlVURjhUb1N0cmluZyhzdHJTdHJpbmcpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFB1c2hOdW1iZXJGb3JKU0Z1bmN0aW9uOiBmdW5jdGlvbiAoX2Z1bmN0aW9uLCBkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRKU0Z1bmN0aW9uQnlJZChfZnVuY3Rpb24pO1xyXG4gICAgICAgICAgICBmdW5jLmFyZ3MucHVzaChkKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFB1c2hPYmplY3RGb3JKU0Z1bmN0aW9uOiBmdW5jdGlvbiAoX2Z1bmN0aW9uLCBjbGFzc0lELCBvYmplY3RJRCkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2goZW5naW5lLmNzaGFycE9iamVjdE1hcC5maW5kT3JBZGRPYmplY3Qob2JqZWN0SUQsIGNsYXNzSUQpKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFB1c2hKU0Z1bmN0aW9uRm9ySlNGdW5jdGlvbjogZnVuY3Rpb24gKF9mdW5jdGlvbiwgSlNGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2gobGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoSlNGdW5jdGlvbikuX2Z1bmMpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUHVzaEpTT2JqZWN0Rm9ySlNGdW5jdGlvbjogZnVuY3Rpb24gKF9mdW5jdGlvbiwgSlNPYmplY3QpIHtcclxuICAgICAgICAgICAgY29uc3QgZnVuYyA9IGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldEpTRnVuY3Rpb25CeUlkKF9mdW5jdGlvbik7XHJcbiAgICAgICAgICAgIGZ1bmMuYXJncy5wdXNoKGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldEpTT2JqZWN0QnlJZChKU09iamVjdCkuZ2V0T2JqZWN0KCkpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUHVzaEFycmF5QnVmZmVyRm9ySlNGdW5jdGlvbjogZnVuY3Rpb24gKF9mdW5jdGlvbiwgLypieXRlW10gKi8gYnl0ZXMsIGxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBmdW5jID0gbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkuZ2V0SlNGdW5jdGlvbkJ5SWQoX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgZnVuYy5hcmdzLnB1c2gobmV3IFVpbnQ4QXJyYXkoZW5naW5lLnVuaXR5QXBpLkhFQVA4LmJ1ZmZlciwgYnl0ZXMsIGxlbmd0aCkpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gV2ViR0xCYWNrZW5kU2V0VG9JbnZva2VKU0FyZ3VtZW50QXBpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXRUb0ludm9rZUpTQXJndW1lbnQuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbGlicmFyeV8xID0gcmVxdWlyZShcIi4uL2xpYnJhcnlcIik7XHJcbi8qKlxyXG4gKiBtaXhpblxyXG4gKiBKU+iwg+eUqEMj5pe277yMQyPorr7nva7ov5Tlm57liLBKU+eahOWAvFxyXG4gKlxyXG4gKiBAcGFyYW0gZW5naW5lXHJcbiAqIEByZXR1cm5zXHJcbiAqL1xyXG5mdW5jdGlvbiBXZWJHTEJhY2tlbmRTZXRUb0pTSW52b2tlUmV0dXJuQXBpKGVuZ2luZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBSZXR1cm5DbGFzczogZnVuY3Rpb24gKGlzb2xhdGUsIGluZm8sIGNsYXNzSUQpIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSW5mbyA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QnlNb2NrUG9pbnRlcihpbmZvKTtcclxuICAgICAgICAgICAgY2FsbGJhY2tJbmZvLnJldHVyblZhbHVlID0gZW5naW5lLmNzaGFycE9iamVjdE1hcC5jbGFzc2VzW2NsYXNzSURdO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmV0dXJuT2JqZWN0OiBmdW5jdGlvbiAoaXNvbGF0ZSwgaW5mbywgY2xhc3NJRCwgc2VsZikge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjYWxsYmFja0luZm8ucmV0dXJuVmFsdWUgPSBlbmdpbmUuY3NoYXJwT2JqZWN0TWFwLmZpbmRPckFkZE9iamVjdChzZWxmLCBjbGFzc0lEKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFJldHVybk51bWJlcjogZnVuY3Rpb24gKGlzb2xhdGUsIGluZm8sIG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjYWxsYmFja0luZm8ucmV0dXJuVmFsdWUgPSBudW1iZXI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBSZXR1cm5TdHJpbmc6IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCBzdHJTdHJpbmcpIHtcclxuICAgICAgICAgICAgY29uc3Qgc3RyID0gZW5naW5lLnVuaXR5QXBpLlVURjhUb1N0cmluZyhzdHJTdHJpbmcpO1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjYWxsYmFja0luZm8ucmV0dXJuVmFsdWUgPSBzdHI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBSZXR1cm5CaWdJbnQ6IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCBsb25nTG93LCBsb25nSGlnaCkge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjYWxsYmFja0luZm8ucmV0dXJuVmFsdWUgPSAoMCwgbGlicmFyeV8xLm1ha2VCaWdJbnQpKGxvbmdMb3csIGxvbmdIaWdoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFJldHVybkJvb2xlYW46IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCBiKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0luZm8gPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEJ5TW9ja1BvaW50ZXIoaW5mbyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrSW5mby5yZXR1cm5WYWx1ZSA9ICEhYjsgLy8g5Lyg6L+H5p2l55qE5pivMeWSjDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIFJldHVybkRhdGU6IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCBkYXRlKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0luZm8gPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEJ5TW9ja1BvaW50ZXIoaW5mbyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrSW5mby5yZXR1cm5WYWx1ZSA9IG5ldyBEYXRlKGRhdGUpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmV0dXJuTnVsbDogZnVuY3Rpb24gKGlzb2xhdGUsIGluZm8pIHtcclxuICAgICAgICAgICAgdmFyIGNhbGxiYWNrSW5mbyA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QnlNb2NrUG9pbnRlcihpbmZvKTtcclxuICAgICAgICAgICAgY2FsbGJhY2tJbmZvLnJldHVyblZhbHVlID0gbnVsbDtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFJldHVybkZ1bmN0aW9uOiBmdW5jdGlvbiAoaXNvbGF0ZSwgaW5mbywgSlNGdW5jdGlvblB0cikge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjb25zdCBqc0Z1bmMgPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRKU0Z1bmN0aW9uQnlJZChKU0Z1bmN0aW9uUHRyKTtcclxuICAgICAgICAgICAgY2FsbGJhY2tJbmZvLnJldHVyblZhbHVlID0ganNGdW5jLl9mdW5jO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmV0dXJuSlNPYmplY3Q6IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCBKU09iamVjdFB0cikge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjb25zdCBqc09iamVjdCA9IGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldEpTT2JqZWN0QnlJZChKU09iamVjdFB0cik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrSW5mby5yZXR1cm5WYWx1ZSA9IGpzT2JqZWN0LmdldE9iamVjdCgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmV0dXJuQ1NoYXJwRnVuY3Rpb25DYWxsYmFjazogZnVuY3Rpb24gKGlzb2xhdGUsIGluZm8sIHY4RnVuY3Rpb25DYWxsYmFjaywgXHJcbiAgICAgICAgLypsb25nICovIHBvaW50ZXJMb3csIFxyXG4gICAgICAgIC8qbG9uZyAqLyBwb2ludGVySGlnaCkge1xyXG4gICAgICAgICAgICB2YXIgY2FsbGJhY2tJbmZvID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRCeU1vY2tQb2ludGVyKGluZm8pO1xyXG4gICAgICAgICAgICBjYWxsYmFja0luZm8ucmV0dXJuVmFsdWUgPSBlbmdpbmUubWFrZVY4RnVuY3Rpb25DYWxsYmFja0Z1bmN0aW9uKGZhbHNlLCB2OEZ1bmN0aW9uQ2FsbGJhY2ssIHBvaW50ZXJMb3cpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgUmV0dXJuQXJyYXlCdWZmZXI6IGZ1bmN0aW9uIChpc29sYXRlLCBpbmZvLCAvKmJ5dGVbXSAqLyBieXRlcywgTGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHZhciBjYWxsYmFja0luZm8gPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEJ5TW9ja1BvaW50ZXIoaW5mbyk7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrSW5mby5yZXR1cm5WYWx1ZSA9IG5ldyBVaW50OEFycmF5KGVuZ2luZS51bml0eUFwaS5IRUFQOC5idWZmZXIsIGJ5dGVzLCBMZW5ndGgpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdlYkdMQmFja2VuZFNldFRvSlNJbnZva2VSZXR1cm5BcGk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNldFRvSlNJbnZva2VSZXR1cm4uanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgbGlicmFyeV8xID0gcmVxdWlyZShcIi4uL2xpYnJhcnlcIik7XHJcbi8qKlxyXG4gKiBtaXhpblxyXG4gKiBKU+iwg+eUqEMj5pe277yMQyPkvqforr7nva5vdXTlj4LmlbDlgLxcclxuICpcclxuICogQHBhcmFtIGVuZ2luZVxyXG4gKiBAcmV0dXJuc1xyXG4gKi9cclxuZnVuY3Rpb24gV2ViR0xCYWNrZW5kU2V0VG9KU091dEFyZ3VtZW50QVBJKGVuZ2luZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBTZXROdW1iZXJUb091dFZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgb2JqID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICAgICAgb2JqLnZhbHVlID0gbnVtYmVyO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgU2V0RGF0ZVRvT3V0VmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgZGF0ZSkge1xyXG4gICAgICAgICAgICB2YXIgb2JqID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICAgICAgb2JqLnZhbHVlID0gbmV3IERhdGUoZGF0ZSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBTZXRTdHJpbmdUb091dFZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIHN0clN0cmluZykge1xyXG4gICAgICAgICAgICBjb25zdCBzdHIgPSBlbmdpbmUudW5pdHlBcGkuVVRGOFRvU3RyaW5nKHN0clN0cmluZyk7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgICAgICBvYmoudmFsdWUgPSBzdHI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBTZXRCb29sZWFuVG9PdXRWYWx1ZTogZnVuY3Rpb24gKGlzb2xhdGUsIHZhbHVlLCBiKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgICAgICBvYmoudmFsdWUgPSAhIWI7IC8vIOS8oOi/h+adpeeahOaYrzHlkowwXHJcbiAgICAgICAgfSxcclxuICAgICAgICBTZXRCaWdJbnRUb091dFZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIC8qbG9uZyAqLyBiaWdJbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdub3QgaW1wbGVtZW50ZWQnKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIFNldE9iamVjdFRvT3V0VmFsdWU6IGZ1bmN0aW9uIChpc29sYXRlLCB2YWx1ZSwgY2xhc3NJRCwgc2VsZikge1xyXG4gICAgICAgICAgICB2YXIgb2JqID0gbGlicmFyeV8xLkZ1bmN0aW9uQ2FsbGJhY2tJbmZvUHRyTWFuYWdlci5HZXRBcmdzQnlNb2NrSW50UHRyKHZhbHVlKTtcclxuICAgICAgICAgICAgb2JqLnZhbHVlID0gZW5naW5lLmNzaGFycE9iamVjdE1hcC5maW5kT3JBZGRPYmplY3Qoc2VsZiwgY2xhc3NJRCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBTZXROdWxsVG9PdXRWYWx1ZTogZnVuY3Rpb24gKGlzb2xhdGUsIHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmogPSBsaWJyYXJ5XzEuRnVuY3Rpb25DYWxsYmFja0luZm9QdHJNYW5hZ2VyLkdldEFyZ3NCeU1vY2tJbnRQdHIodmFsdWUpO1xyXG4gICAgICAgICAgICBvYmoudmFsdWUgPSBudWxsOyAvLyDkvKDov4fmnaXnmoTmmK8x5ZKMMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgU2V0QXJyYXlCdWZmZXJUb091dFZhbHVlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgdmFsdWUsIC8qQnl0ZVtdICovIGJ5dGVzLCBMZW5ndGgpIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IGxpYnJhcnlfMS5GdW5jdGlvbkNhbGxiYWNrSW5mb1B0ck1hbmFnZXIuR2V0QXJnc0J5TW9ja0ludFB0cih2YWx1ZSk7XHJcbiAgICAgICAgICAgIG9iai52YWx1ZSA9IG5ldyBVaW50OEFycmF5KGVuZ2luZS51bml0eUFwaS5IRUFQOC5idWZmZXIsIGJ5dGVzLCBMZW5ndGgpO1xyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59XHJcbmV4cG9ydHMuZGVmYXVsdCA9IFdlYkdMQmFja2VuZFNldFRvSlNPdXRBcmd1bWVudEFQSTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2V0VG9KU091dEFyZ3VtZW50LmpzLm1hcCIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8qKlxyXG4gKiDmoLnmja4gaHR0cHM6Ly9kb2NzLnVuaXR5M2QuY29tLzIwMTguNC9Eb2N1bWVudGF0aW9uL01hbnVhbC93ZWJnbC1pbnRlcmFjdGluZ3dpdGhicm93c2Vyc2NyaXB0aW5nLmh0bWxcclxuICog5oiR5Lus55qE55uu55qE5bCx5piv5ZyoV2ViR0zmqKHlvI/kuIvvvIzlrp7njrDlkoxwdWVydHMuZGxs55qE5pWI5p6c44CC5YW35L2T5Zyo5LqO5a6e546w5LiA5LiqanNsaWLvvIzph4zpnaLlupTljIXlkKtQdWVydHNETEwuY3PnmoTmiYDmnInmjqXlj6NcclxuICog5a6e6aqM5Y+R546w6L+Z5LiqanNsaWLomb3nhLbkuZ/mmK/ov5DooYzlnKh2OOeahGpz77yM5L2G5a+5ZGV2dG9vbOiwg+ivleW5tuS4jeWPi+Wlve+8jOS4lOWPquaUr+aMgeWIsGVzNeOAglxyXG4gKiDlm6DmraTlupTor6XpgJrov4fkuIDkuKrni6znq4vnmoRqc+WunueOsOaOpeWPo++8jHB1ZXJ0cy5qc2xpYumAmui/h+WFqOWxgOeahOaWueW8j+iwg+eUqOWug+OAglxyXG4gKlxyXG4gKiDmnIDnu4jlvaLmiJDlpoLkuIvmnrbmnoRcclxuICog5Lia5YqhSlMgPC0+IFdBU00gPC0+IHVuaXR5IGpzbGliIDwtPiDmnKxqc1xyXG4gKiDkvYbmlbTmnaHpk77ot6/lhbblrp7pg73lnKjkuIDkuKp2OChqc2NvcmUp6Jma5ouf5py66YeMXHJcbiAqL1xyXG5jb25zdCBsaWJyYXJ5XzEgPSByZXF1aXJlKFwiLi9saWJyYXJ5XCIpO1xyXG5jb25zdCBnZXRGcm9tSlNBcmd1bWVudF8xID0gcmVxdWlyZShcIi4vbWl4aW5zL2dldEZyb21KU0FyZ3VtZW50XCIpO1xyXG5jb25zdCBnZXRGcm9tSlNSZXR1cm5fMSA9IHJlcXVpcmUoXCIuL21peGlucy9nZXRGcm9tSlNSZXR1cm5cIik7XHJcbmNvbnN0IHJlZ2lzdGVyXzEgPSByZXF1aXJlKFwiLi9taXhpbnMvcmVnaXN0ZXJcIik7XHJcbmNvbnN0IHNldFRvSW52b2tlSlNBcmd1bWVudF8xID0gcmVxdWlyZShcIi4vbWl4aW5zL3NldFRvSW52b2tlSlNBcmd1bWVudFwiKTtcclxuY29uc3Qgc2V0VG9KU0ludm9rZVJldHVybl8xID0gcmVxdWlyZShcIi4vbWl4aW5zL3NldFRvSlNJbnZva2VSZXR1cm5cIik7XHJcbmNvbnN0IHNldFRvSlNPdXRBcmd1bWVudF8xID0gcmVxdWlyZShcIi4vbWl4aW5zL3NldFRvSlNPdXRBcmd1bWVudFwiKTtcclxubGlicmFyeV8xLmdsb2JhbC53eFJlcXVpcmUgPSBsaWJyYXJ5XzEuZ2xvYmFsLnJlcXVpcmU7XHJcbmxpYnJhcnlfMS5nbG9iYWwuUHVlcnRzV2ViR0wgPSB7XHJcbiAgICBpbml0ZWQ6IGZhbHNlLFxyXG4gICAgZGVidWc6IGZhbHNlLFxyXG4gICAgLy8gcHVlcnRz6aaW5qyh5Yid5aeL5YyW5pe25Lya6LCD55So6L+Z6YeM77yM5bm25oqKVW5pdHnnmoTpgJrkv6HmjqXlj6PkvKDlhaVcclxuICAgIEluaXQoeyBVVEY4VG9TdHJpbmcsIF9tYWxsb2MsIF9tZW1zZXQsIF9tZW1jcHksIF9mcmVlLCBzdHJpbmdUb1VURjgsIGxlbmd0aEJ5dGVzVVRGOCwgdW5pdHlJbnN0YW5jZSB9KSB7XHJcbiAgICAgICAgY29uc3QgZW5naW5lID0gbmV3IGxpYnJhcnlfMS5QdWVydHNKU0VuZ2luZSh7XHJcbiAgICAgICAgICAgIFVURjhUb1N0cmluZywgX21hbGxvYywgX21lbXNldCwgX21lbWNweSwgX2ZyZWUsIHN0cmluZ1RvVVRGOCwgbGVuZ3RoQnl0ZXNVVEY4LCB1bml0eUluc3RhbmNlXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY29uc3QgZXhlY3V0ZU1vZHVsZUNhY2hlID0ge307XHJcbiAgICAgICAgbGV0IGpzRW5naW5lUmV0dXJuZWQgPSBmYWxzZTtcclxuICAgICAgICAvLyBQdWVydHNETEznmoTmiYDmnInmjqXlj6Plrp7njrBcclxuICAgICAgICBsaWJyYXJ5XzEuZ2xvYmFsLlB1ZXJ0c1dlYkdMID0gT2JqZWN0LmFzc2lnbihsaWJyYXJ5XzEuZ2xvYmFsLlB1ZXJ0c1dlYkdMLCAoMCwgZ2V0RnJvbUpTQXJndW1lbnRfMS5kZWZhdWx0KShlbmdpbmUpLCAoMCwgZ2V0RnJvbUpTUmV0dXJuXzEuZGVmYXVsdCkoZW5naW5lKSwgKDAsIHNldFRvSW52b2tlSlNBcmd1bWVudF8xLmRlZmF1bHQpKGVuZ2luZSksICgwLCBzZXRUb0pTSW52b2tlUmV0dXJuXzEuZGVmYXVsdCkoZW5naW5lKSwgKDAsIHNldFRvSlNPdXRBcmd1bWVudF8xLmRlZmF1bHQpKGVuZ2luZSksICgwLCByZWdpc3Rlcl8xLmRlZmF1bHQpKGVuZ2luZSksIHtcclxuICAgICAgICAgICAgLy8gYnJpZGdlTG9nOiB0cnVlLFxyXG4gICAgICAgICAgICBTZXRDYWxsVjg6IGZ1bmN0aW9uIChjYWxsVjhGdW5jdGlvbiwgY2FsbFY4Q29uc3RydWN0b3IsIGNhbGxWOERlc3RydWN0b3IsIGNhbGxKU0FyZ3VtZW50c0dldHRlcikge1xyXG4gICAgICAgICAgICAgICAgZW5naW5lLmNhbGxWOEZ1bmN0aW9uID0gY2FsbFY4RnVuY3Rpb247XHJcbiAgICAgICAgICAgICAgICBlbmdpbmUuY2FsbFY4Q29uc3RydWN0b3IgPSBjYWxsVjhDb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgICAgIGVuZ2luZS5jYWxsVjhEZXN0cnVjdG9yID0gY2FsbFY4RGVzdHJ1Y3RvcjtcclxuICAgICAgICAgICAgICAgIGVuZ2luZS5jYWxsSlNBcmd1bWVudHNHZXR0ZXIgPSBjYWxsSlNBcmd1bWVudHNHZXR0ZXI7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEdldExpYlZlcnNpb246IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxNztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgR2V0QXBpTGV2ZWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxNztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgR2V0TGliQmFja2VuZDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENyZWF0ZUpTRW5naW5lOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoanNFbmdpbmVSZXR1cm5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIm9ubHkgb25lIGF2YWlsYWJsZSBqc0VudiBpcyBhbGxvd2VkIGluIFdlYkdMIG1vZGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBqc0VuZ2luZVJldHVybmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxMDI0O1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDcmVhdGVKU0VuZ2luZVdpdGhFeHRlcm5hbEVudjogZnVuY3Rpb24gKCkgeyB9LFxyXG4gICAgICAgICAgICBEZXN0cm95SlNFbmdpbmU6IGZ1bmN0aW9uICgpIHsgfSxcclxuICAgICAgICAgICAgR2V0TGFzdEV4Y2VwdGlvbkluZm86IGZ1bmN0aW9uIChpc29sYXRlLCAvKiBvdXQgaW50ICovIHN0cmxlbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5KU1N0cmluZ1RvQ1NTdHJpbmcoZW5naW5lLmxhc3RFeGNlcHRpb24ubWVzc2FnZSwgc3RybGVuKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgTG93TWVtb3J5Tm90aWZpY2F0aW9uOiBmdW5jdGlvbiAoaXNvbGF0ZSkge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTZXRHZW5lcmFsRGVzdHJ1Y3RvcjogZnVuY3Rpb24gKGlzb2xhdGUsIF9nZW5lcmFsRGVzdHJ1Y3Rvcikge1xyXG4gICAgICAgICAgICAgICAgZW5naW5lLmdlbmVyYWxEZXN0cnVjdG9yID0gX2dlbmVyYWxEZXN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBTZXRNb2R1bGVSZXNvbHZlcjogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBFeGVjdXRlTW9kdWxlOiBmdW5jdGlvbiAoaXNvbGF0ZSwgcGF0aFN0cmluZywgZXhwb3J0ZWUpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGVOYW1lID0gVVRGOFRvU3RyaW5nKHBhdGhTdHJpbmcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChmaWxlTmFtZS5pbmRleE9mKCdsb2cubWpzJykgIT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygd3ggIT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gd3hSZXF1aXJlKCdwdWVydHNfbWluaWdhbWVfanNfcmVzb3VyY2VzLycgKyBmaWxlTmFtZS5yZXBsYWNlKCcubWpzJywgJy5qcycpLnJlcGxhY2UoJy5janMnLCAnLmpzJykpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhwb3J0ZWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVuZ2luZS5sYXN0UmV0dXJuQ1NSZXN1bHQgPSByZXN1bHRbVVRGOFRvU3RyaW5nKGV4cG9ydGVlKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDI0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0geyBleHBvcnRzOiB7fSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXhlY3V0ZU1vZHVsZUNhY2hlW2ZpbGVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmV4cG9ydHMgPSBleGVjdXRlTW9kdWxlQ2FjaGVbZmlsZU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFQVUVSVFNfSlNfUkVTT1VSQ0VTW2ZpbGVOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2ZpbGUgbm90IGZvdW5kJyArIGZpbGVOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBVRVJUU19KU19SRVNPVVJDRVNbZmlsZU5hbWVdKHJlc3VsdC5leHBvcnRzLCBsaWJyYXJ5XzEuZ2xvYmFsWydyZXF1aXJlJ10sIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleGVjdXRlTW9kdWxlQ2FjaGVbZmlsZU5hbWVdID0gcmVzdWx0LmV4cG9ydHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGV4cG9ydGVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0ID0gcmVzdWx0LmV4cG9ydHNbVVRGOFRvU3RyaW5nKGV4cG9ydGVlKV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0ID0gcmVzdWx0LmV4cG9ydHM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmdpbmUubGFzdEV4Y2VwdGlvbiA9IGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIEV2YWw6IGZ1bmN0aW9uIChpc29sYXRlLCBjb2RlU3RyaW5nLCBwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWxpYnJhcnlfMS5nbG9iYWwuZXZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImV2YWwgaXMgbm90IHN1cHBvcnRlZFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSBVVEY4VG9TdHJpbmcoY29kZVN0cmluZyk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBsaWJyYXJ5XzEuZ2xvYmFsLmV2YWwoY29kZSk7XHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm4gZ2V0SW50UHRyTWFuYWdlcigpLkdldFBvaW50ZXJGb3JKU1ZhbHVlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0ID0gcmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC8qRlJlc3VsdEluZm8gKi8gMTAyNDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgU2V0UHVzaEpTRnVuY3Rpb25Bcmd1bWVudHNDYWxsYmFjazogZnVuY3Rpb24gKGlzb2xhdGUsIGNhbGxiYWNrLCBqc0VudklkeCkge1xyXG4gICAgICAgICAgICAgICAgZW5naW5lLkdldEpTQXJndW1lbnRzQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgVGhyb3dFeGNlcHRpb246IGZ1bmN0aW9uIChpc29sYXRlLCAvKmJ5dGVbXSAqLyBtZXNzYWdlU3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoVVRGOFRvU3RyaW5nKG1lc3NhZ2VTdHJpbmcpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgSW52b2tlSlNGdW5jdGlvbjogZnVuY3Rpb24gKF9mdW5jdGlvbiwgYXJndW1lbnRzTGVuLCBoYXNSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBsaWJyYXJ5XzEuanNGdW5jdGlvbk9yT2JqZWN0RmFjdG9yeS5nZXRKU0Z1bmN0aW9uQnlJZChfZnVuY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50c0xlbiA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmdpbmUuY2FsbEdldEpTQXJndW1lbnRzQ2FsbGJhY2soMCwgX2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChmdW5jIGluc3RhbmNlb2YgbGlicmFyeV8xLkpTRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmdpbmUubGFzdFJldHVybkNTUmVzdWx0ID0gZnVuYy5pbnZva2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMjQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignSW52b2tlSlNGdW5jdGlvbiBlcnJvcicsIGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmMubGFzdEV4Y2VwdGlvbiA9IGVycjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B0ciBpcyBub3QgYSBqc2Z1bmMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgR2V0RnVuY3Rpb25MYXN0RXhjZXB0aW9uSW5mbzogZnVuY3Rpb24gKF9mdW5jdGlvbiwgLypvdXQgaW50ICovIGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LmdldEpTRnVuY3Rpb25CeUlkKF9mdW5jdGlvbik7XHJcbiAgICAgICAgICAgICAgICBpZiAoZnVuYyBpbnN0YW5jZW9mIGxpYnJhcnlfMS5KU0Z1bmN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVuZ2luZS5KU1N0cmluZ1RvQ1NTdHJpbmcoZnVuYy5sYXN0RXhjZXB0aW9uLm1lc3NhZ2UgfHwgJycsIGxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3B0ciBpcyBub3QgYSBqc2Z1bmMnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgUmVsZWFzZUpTRnVuY3Rpb246IGZ1bmN0aW9uIChpc29sYXRlLCBfZnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIGxpYnJhcnlfMS5qc0Z1bmN0aW9uT3JPYmplY3RGYWN0b3J5LnJlbW92ZUpTRnVuY3Rpb25CeUlkKF9mdW5jdGlvbik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFJlbGVhc2VKU09iamVjdDogZnVuY3Rpb24gKGlzb2xhdGUsIG9iaikge1xyXG4gICAgICAgICAgICAgICAgbGlicmFyeV8xLmpzRnVuY3Rpb25Pck9iamVjdEZhY3RvcnkucmVtb3ZlSlNPYmplY3RCeUlkKG9iaik7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFJlc2V0UmVzdWx0OiBmdW5jdGlvbiAocmVzdWx0SW5mbykge1xyXG4gICAgICAgICAgICAgICAgZW5naW5lLmxhc3RSZXR1cm5DU1Jlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIENyZWF0ZUluc3BlY3RvcjogZnVuY3Rpb24gKGlzb2xhdGUsIHBvcnQpIHsgfSxcclxuICAgICAgICAgICAgRGVzdHJveUluc3BlY3RvcjogZnVuY3Rpb24gKGlzb2xhdGUpIHsgfSxcclxuICAgICAgICAgICAgSW5zcGVjdG9yVGljazogZnVuY3Rpb24gKGlzb2xhdGUpIHsgfSxcclxuICAgICAgICAgICAgTG9naWNUaWNrOiBmdW5jdGlvbiAoaXNvbGF0ZSkgeyB9LFxyXG4gICAgICAgICAgICBTZXRMb2dDYWxsYmFjazogZnVuY3Rpb24gKGxvZywgbG9nV2FybmluZywgbG9nRXJyb3IpIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59O1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=