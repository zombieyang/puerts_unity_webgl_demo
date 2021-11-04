var exportDLL = {
    _Init: function () {
        debugger;
        window.global = window;
        var FunctionCallbackInfo = function (args) {
            this.args = args;
            this.returnValue = undefined;
        }

        var intPtrManagerInstance = null;
        var getIntPtrManager = function () {
            if (!intPtrManagerInstance) {
                intPtrManagerInstance = (function () {
                    var infos = [0];
                    var values = [0, void 0];
                    var valueWeakMap = new WeakMap();

                    return {
                        // v8::CallbackInfo
                        GetPointerForCallbackInfo: function (args) {
                            infos.push(args);
                            return infos.length - 1;
                        },
                        GetCallbackInfoForPointer: function (intptr) {
                            return infos[intptr];
                        },

                        // v8::Value
                        GetPointerForJSValue: function (args) {
                            if (typeof args == 'undefined') {
                                return 1
                            }
                            var isFunctionOrObject = typeof args == 'function' || typeof args == 'object';
                            if (isFunctionOrObject) {
                                var id = valueWeakMap.get(args)
                                if (id) {
                                    return id;
                                }
                            }
                            values.push(args);
                            if (isFunctionOrObject) {
                                valueWeakMap.set(args, values.length - 1);
                            }
                            return values.length - 1;
                        },
                        GetJSValueForPointer: function (intptr) {
                            return values[intptr];
                        }
                    }
                })();
            }
            return intPtrManagerInstance
        }
        var nativeObjectMap = (function () {
            var nativeObjectKV = {};
            var objectIDWeakMap = new WeakMap();

            return {
                add: function (csObjectID, obj) {
                    nativeObjectKV[csObjectID] = new WeakRef(obj);
                    objectIDWeakMap.set(obj, csObjectID);
                },
                findOrAddObject: function (csObjectID, classID) {
                    var ret;
                    if (nativeObjectKV[csObjectID] && (ret = nativeObjectKV[csObjectID].deref())) {
                        return ret;
                    }
                    ret = new classes[classID](csObjectID);
                    this.add(csObjectID, ret);
                    return ret;
                },
                getCSObjectIDFromObject: function (obj) {
                    return objectIDWeakMap.get(obj);
                }
            }
        })()
        var jsFunctionOrObjectFactory = (function () {
            var id = 1;
            var idmap = new WeakMap();
            var jsFuncOrObjectKV = {};
            function JSFunction(func) {
                this._func = func;
                this.id = id++;
                idmap.set(func, this.id);
                jsFuncOrObjectKV[this.id] = this;
                this.args = [];
                this.lastExceptionInfo = '';
            }
            JSFunction.prototype.invoke = function () {
                var args = this.args.slice(0);
                this.args = [];
                this._func.apply(this, args);
            }
            return {
                JSFunction: JSFunction,
                getOrCreateJSFunction: function (funcValue) {
                    if (idmap.get(funcValue)) {
                        return jsFuncOrObjectKV[idmap.get(funcValue)];
                    }
                    return new JSFunction(funcValue);
                },
                getJSFunctionById: function (id) {
                    jsFuncOrObjectKV[this.id]
                },
                removeJSFunctionById: function (id) {
                    delete jsFuncOrObjectKV[this.id]
                }
            }
        })()
        function toCSString(returnStr) {
            var bufferSize = lengthBytesUTF8(returnStr) + 1;
            var buffer = _malloc(bufferSize);
            stringToUTF8(returnStr, buffer, bufferSize);
            return buffer;
        }

        function callV8FunctionCallback(functionPtr, selfPtr, infoIntPtr, paramLen, data) {
            Module.SendMessage('__PuertsBridge', 'SetInfoPtr', infoIntPtr);
            Module.SendMessage('__PuertsBridge', 'SetSelfPtr', selfPtr || 0);
            Module.SendMessage('__PuertsBridge', 'SetData', data);
            Module.SendMessage('__PuertsBridge', 'SetParamLen', paramLen);
            Module.SendMessage('__PuertsBridge', 'CallV8FunctionCallback', functionPtr);
        }
        function makeV8FunctionCallbackFunction(functionPtr, data) {
            return function () {
                var args = Array.prototype.slice.call(arguments, 0);
                var callbackInfo = new FunctionCallbackInfo(args)
                callV8FunctionCallback(
                    functionPtr,
                    // getIntPtrManager().GetPointerForJSValue(this),
                    nativeObjectMap.getCSObjectIDFromObject(this),
                    getIntPtrManager().GetPointerForCallbackInfo(callbackInfo),
                    args.length,
                    data
                )

                return callbackInfo.returnValue;
            }
        }
        function callV8ConstructorCallback(functionPtr, infoIntPtr, paramLen, data) {
            Module.SendMessage('__PuertsBridge', 'SetInfoPtr', infoIntPtr);
            Module.SendMessage('__PuertsBridge', 'SetData', data);
            Module.SendMessage('__PuertsBridge', 'SetParamLen', paramLen);
            Module.SendMessage('__PuertsBridge', 'CallV8ConstructorCallback', functionPtr);
            return getLastResult();
        }
        function callV8DestructorCallback(functionPtr, selfPtr, data) {
            // 虽然这里看起来像是this指针，但它实际上是CS里对象池的一个id
            Module.SendMessage('__PuertsBridge', 'SetSelfPtr', selfPtr);
            Module.SendMessage('__PuertsBridge', 'SetData', data);
            Module.SendMessage('__PuertsBridge', 'callV8DestructorCallback', functionPtr);
        }
        var onFinalize = (function () {
            var destructors = {};

            var registry = null
            function init() {
                registry = new window.FinalizationRegistry(function (heldValue) {
                    var callback = destructors[heldValue];
                    if (!(heldValue in destructors)) {
                        throw new Error("cannot find destructor for" + heldValue);
                    }
                    delete destructors[heldValue]
                    console.log('onFinalize', heldValue)
                    callback(heldValue);
                });
            }

            return function (obj, heldValue, callback) {
                if (!registry) {
                    init();
                }
                destructors[heldValue] = callback;
                registry.register(obj, heldValue);
            }
        })();

        var lastCallCSResult = null;
        var lastCallCSResultType = null;
        function getLastResult() {
            return lastCallCSResult
        }

        var lastReturnCSResult = null;

        var classes = [];
        var namesToClassesID = {};
        var classIDWeakMap = new WeakMap();
        var generalDestructor = null;

        global.__tgjsEvalScript = eval;
        global.__tgjsSetPromiseRejectCallback = function (callback) {
            window.addEventListener("unhandledrejection", callback);
        }

        const executeModuleCache = {};

        window.PuertsWebGL = {
            SetLastResult: function (res) {
                lastCallCSResult = res;
            },
            SetLastResultType: function (type) {
                lastCallCSResultType = type;
            },

            GetLibVersion: function () {
                return 14;
            },
            GetLibBackend: function () {
                return 0;
            },
            SetGlobalFunction: function (/*IntPtr */isolate, /*string */name, /*IntPtr */v8FunctionCallback, /*long */data) {
                name = Pointer_stringify(name);
                global[name] = makeV8FunctionCallbackFunction(v8FunctionCallback, data);
            },
            GetLastExceptionInfo: function (/*IntPtr */isolate,/* out int */strlen) {

            },
            LowMemoryNotification: function (/*IntPtr */isolate) {

            },
            SetGeneralDestructor: function (/*IntPtr */isolate, /*IntPtr */_generalDestructor) {
                generalDestructor = _generalDestructor
            },

            ExecuteFile: function (/*IntPtr */isolate, /*string */path) {
                if (typeof wx != 'undefined') {
                    lastReturnCSResult = require('puerts_minigame_js_resources/' + path)

                } else {
                    const result = { exports: {} };
                    const fileName = Pointer_stringify(path);
                    if (executeModuleCache[fileName]) {
                        lastReturnCSResult = executeModuleCache[fileName];
                        return;
                    }
                    if (!PUERTS_JS_RESOURCES[fileName]) {
                        console.error('file not found' + fileName);
                    }
                    PUERTS_JS_RESOURCES[fileName](result.exports, window.require, result)
                    lastReturnCSResult = executeModuleCache[fileName] = result.exports;
                }
            },
            Eval: function (/*IntPtr */isolate, /*string */code, /*string */path) {
                code = Pointer_stringify(code);
                const result = window.eval(code);
                // return getIntPtrManager().GetPointerForJSValue(result);
                lastReturnCSResult = result;
                return /*FResultInfo */1024;
            },


            _RegisterClass: function (/*IntPtr */isolate, /*int */BaseTypeId, /*string */fullName, /*IntPtr */constructor, /*IntPtr */destructor, /*long */data) {
                fullName = Pointer_stringify(fullName);

                var id = Object.keys(classes).length
                classes[id] = function (csObjectID) {
                    // nativeObject的构造函数
                    // 这个函数有两个调用的地方：1. js侧new一个它的时候 2. cs侧创建了一个对象要传到js侧时
                    // 第一个情况，cs对象ID是callV8ConstructorCallback返回的。第二个情况，则是cs new完之后一并传给js的
                    var args = Array.prototype.slice.call(arguments, 0);
                    var argsIntPtr = getIntPtrManager().GetPointerForCallbackInfo(args);

                    // 虽然puerts内Constructor的返回值叫self，但它其实就是CS对象的一个id而已。
                    csObjectID = csObjectID || callV8ConstructorCallback(constructor, argsIntPtr, args.length, data);
                    nativeObjectMap.add(csObjectID, this);

                    onFinalize(this, csObjectID, function (csObjectID) {
                        callV8DestructorCallback(destructor || generalDestructor, csObjectID, data);
                    })
                }
                classIDWeakMap.set(classes[id], id);

                if (BaseTypeId > 0) {
                    classes[id].prototype.__proto__ = classes[BaseTypeId].prototype
                }
                namesToClassesID[fullName] = id;

                return id;
            },
            RegisterStruct: function (/*IntPtr */isolate, /*int */BaseTypeId, /*string */fullName, /*IntPtr */constructor, /*IntPtr */destructor, /*long */data, /*int */size) {
            },
            RegisterFunction: function (/*IntPtr */isolate, /*int */classID, /*string */name, /*bool */isStatic, /*IntPtr */callback, /*long */data) {
                var cls = classes[classID]
                if (!cls) {
                    return false;
                }
                name = Pointer_stringify(name);

                var fn = makeV8FunctionCallbackFunction(callback, data)
                if (isStatic) {
                    cls[name] = fn

                } else {
                    cls.prototype[name] = fn
                }
            },
            RegisterProperty: function (/*IntPtr */isolate, /*int */classID, /*string */name, /*bool */isStatic, /*IntPtr */getter, /*long */getterData, /*IntPtr */setter, /*long */setterData, /*bool */dontDelete) {
                var cls = classes[classID]
                if (!cls) {
                    return false;
                }
                name = Pointer_stringify(name);

                var attr = {};
                if (dontDelete) {
                    attr.configurable = false;
                }
                attr.get = makeV8FunctionCallbackFunction(getter, getterData);
                if (setter) {
                    attr.set = makeV8FunctionCallbackFunction(setter, setterData);
                }

                if (isStatic) {
                    Object.defineProperty(cls, name, attr)

                } else {
                    Object.defineProperty(cls.prototype, name, attr)
                }
            },


            ReturnClass: function (/*IntPtr */isolate, /*IntPtr */info, /*int */classID) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = classes[classID];
            },
            ReturnObject: function (/*IntPtr */isolate, /*IntPtr */info, /*int */classID, /*IntPtr */self) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = nativeObjectMap.findOrAddObject(self, classID);
            },
            ReturnNumber: function (/*IntPtr */isolate, /*IntPtr */info, /*double */number) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = number;
            },
            ReturnString: function (/*IntPtr */isolate, /*IntPtr */info, /*string */str) {
                str = Pointer_stringify(str);
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = str;
            },
            ReturnBigInt: function (/*IntPtr */isolate, /*IntPtr */info, /*long */number) {
                throw new Error('not implemented')
            },
            ReturnBoolean: function (/*IntPtr */isolate, /*IntPtr */info, /*bool */b) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = b;
            },
            ReturnDate: function (/*IntPtr */isolate, /*IntPtr */info, /*double */date) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = new Date(date);
            },
            ReturnNull: function (/*IntPtr */isolate, /*IntPtr */info) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                callbackInfo.returnValue = null;
            },
            ReturnFunction: function (/*IntPtr */isolate, /*IntPtr */info, /*IntPtr */JSFunction) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                var jsFunc = getIntPtrManager().GetJSValueForPointer(JSFunction)
                callbackInfo.returnValue = jsFunc.func;
            },
            ReturnJSObject: function (/*IntPtr */isolate, /*IntPtr */info, /*IntPtr */JSObject) {
                throw new Error('not implemented')
            },
            ReturnArrayBuffer: function (/*IntPtr */isolate, /*IntPtr */info, /*byte[] */bytes, /*int */Length) {
                throw new Error('not implemented')
            },


            GetArgumentType: function (/*IntPtr */isolate, /*IntPtr */info, /*int */index, /*bool */isByRef) {
                var value = info[index];
                if (typeof value == 'undefined') { return 1 }
                if (typeof value == 'number') { return 4 }
                if (typeof value == 'string') { return 8 }
                if (typeof value == 'boolean') { return 16 }
                if (typeof value == 'function') { return 256 }
                if (value instanceof Date) { return 512 }
                if (value instanceof Array) { return 128 }
                if (nativeObjectMap.getCSObjectIDFromObject(value)) { return 32 }
                return 64;
            },
            GetArgumentValue: function (/*IntPtr */info, /*int */index) {
                var callbackInfo = getIntPtrManager().GetCallbackInfoForPointer(info);
                return getIntPtrManager().GetPointerForJSValue(callbackInfo.args[index]);
            },
            GetJsValueType: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
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
                var value = getIntPtrManager().GetJSValueForPointer(value);
                if (typeof value == 'undefined') { return 1 }
                if (typeof value == 'number') { return 4 }
                if (typeof value == 'string') { return 8 }
                if (typeof value == 'boolean') { return 16 }
                if (typeof value == 'function') { return 256 }
                if (value instanceof Date) { return 512 }
                if (value instanceof Array) { return 128 }
                if (nativeObjectMap.getCSObjectIDFromObject(value)) { return 32 }
                return 64;
            },
            GetTypeIdFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                var obj = getIntPtrManager().GetJSValueForPointer(value)
                var typeid = 0;
                if (typeof obj == 'function') {
                    typeid = classIDWeakMap.get(obj);

                } else if (obj instanceof jsFunctionOrObjectFactory.JSFunction) {
                    typeid = classIDWeakMap.get(obj._func);

                } else {
                    typeid = classIDWeakMap.get(obj.__proto__.constructor);
                }

                if (!typeid) {
                    throw new Error('cannot find typeid for' + value)
                }
                return typeid
            },
            GetNumberFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                return getIntPtrManager().GetJSValueForPointer(value);
            },
            GetDateFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                return getIntPtrManager().GetJSValueForPointer(value).getTime();
            },
            GetStringFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                var returnStr = getIntPtrManager().GetJSValueForPointer(value);
                return toCSString(returnStr);
            },
            GetBooleanFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                return getIntPtrManager().GetJSValueForPointer(value);
            },
            ValueIsBigInt: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                throw new Error('not implemented')
            },
            GetBigIntFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                throw new Error('not implemented')
            },
            GetObjectFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                var nativeObject = getIntPtrManager().GetJSValueForPointer(value);
                return nativeObjectMap.getCSObjectIDFromObject(nativeObject);
            },
            GetFunctionFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                var func = getIntPtrManager().GetJSValueForPointer(value);
                var jsfunc = jsFunctionOrObjectFactory.getOrCreateJSFunction(func);
                return getIntPtrManager().GetPointerForJSValue(jsfunc);
            },
            GetJSObjectFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */isByRef) {
                throw new Error('not implemented')
            },
            GetArrayBufferFromValue: function (/*IntPtr */isolate, /*IntPtr */value, /*out int */length, /*bool */isOut) {
                throw new Error('not implemented')
            },

            SetNumberToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*double */number) {
                var obj = getIntPtrManager().GetJSValueForPointer(value);
                obj.value = number

            },
            SetDateToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*double */date) {
                var obj = getIntPtrManager().GetJSValueForPointer(value);
                obj.value = new Date(date);
            },
            SetStringToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*string */str) {


            },
            SetBooleanToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*bool */b) {
                var obj = getIntPtrManager().GetJSValueForPointer(value);
                obj.value = b

            },
            SetBigIntToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*long */bigInt) {
                throw new Error('not implemented')

            },
            SetObjectToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*int */classId, /*IntPtr */ptr) {
                throw new Error('not implemented')

            },
            SetNullToOutValue: function (/*IntPtr */isolate, /*IntPtr */value) {
                var obj = getIntPtrManager().GetJSValueForPointer(value);
                obj.value = null

            },
            SetArrayBufferToOutValue: function (/*IntPtr */isolate, /*IntPtr */value, /*Byte[] */bytes, /*int */length) {
                throw new Error('not implemented')

            },

            ThrowException: function (/*IntPtr */isolate, /*byte[] */message) {
                throw new Error(Pointer_stringify(message));
            },

            //begin cs call js
            PushNullForJSFunction: function (/*IntPtr */_function) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(null);

            },
            PushDateForJSFunction: function (/*IntPtr */_function, /*double */dateValue) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(new Date(dateValue));

            },
            PushBooleanForJSFunction: function (/*IntPtr */_function, /*bool */b) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(b);

            },
            PushBigIntForJSFunction: function (/*IntPtr */_function, /*long */l) {
                throw new Error('not implemented')

            },
            PushStringForJSFunction: function (/*IntPtr */_function, /*string */str) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(Pointer_stringify(str));

            },
            PushNumberForJSFunction: function (/*IntPtr */_function, /*double */d) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(d);

            },
            PushObjectForJSFunction: function (/*IntPtr */_function, /*int */classID, /*IntPtr */objectID) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(nativeObjectMap.findOrAddObject(objectID, classID));
            },
            PushJSFunctionForJSFunction: function (/*IntPtr */_function, /*IntPtr */JSFunction) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                func.args.push(getIntPtrManager().GetJSValueForPointer(JSFunction));

            },
            PushJSObjectForJSFunction: function (/*IntPtr */_function, /*IntPtr */JSObject) {
                throw new Error('not implemented')

            },
            PushArrayBufferForJSFunction: function (/*IntPtr */_function, /*byte[] */bytes, /*int */length) {
                throw new Error('not implemented')

            },

            InvokeJSFunction: function (/*IntPtr */_function, /*bool */hasResult) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                if (func instanceof jsFunctionOrObjectFactory.JSFunction) {
                    try {
                        lastReturnCSResult = func.invoke();
                        return 1024;

                    } catch (err) {
                        console.error('InvokeJSFunction error', err);
                        func.lastExceptionInfo = err.message
                    }

                } else {
                    throw new Error('ptr is not a jsfunc');
                }
            },
            GetFunctionLastExceptionInfo: function (/*IntPtr */_function, /*out int */len) {
                const func = getIntPtrManager().GetJSValueForPointer(_function);
                if (func instanceof jsFunctionOrObjectFactory.JSFunction) {
                    return toCSString(func.lastExceptionInfo || '');

                } else {
                    throw new Error('ptr is not a jsfunc');
                }

            },
            ReleaseJSFunction: function (/*IntPtr */isolate, /*IntPtr */_function) {
                throw new Error('not implemented')

            },
            ReleaseJSObject: function (/*IntPtr */isolate, /*IntPtr */obj) {
                throw new Error('not implemented')

            },


            //保守方案
            GetResultType: function (/*IntPtr */resultInfo) {
                var value = lastReturnCSResult;
                if (typeof value == 'undefined') { return 1 }
                if (typeof value == 'number') { return 4 }
                if (typeof value == 'string') { return 8 }
                if (typeof value == 'boolean') { return 16 }
                if (typeof value == 'function') { return 256 }
                if (value instanceof Date) { return 512 }
                if (value instanceof Array) { return 128 }
                if (nativeObjectMap.getCSObjectIDFromObject(value)) { return 32 }
                return 64;
            },
            GetNumberFromResult: function (/*IntPtr */resultInfo) {
                return lastReturnCSResult;

            },
            GetDateFromResult: function (/*IntPtr */resultInfo) {
                return lastReturnCSResult.getTime();

            },
            GetStringFromResult: function (/*IntPtr */resultInfo, /*out int */len) {
                return toCSString(lastReturnCSResult)

            },
            GetBooleanFromResult: function (/*IntPtr */resultInfo) {
                return lastReturnCSResult;

            },
            ResultIsBigInt: function (/*IntPtr */resultInfo) {
                throw new Error('not implemented')

            },
            GetBigIntFromResult: function (/*IntPtr */resultInfo) {
                throw new Error('not implemented')

            },
            GetObjectFromResult: function (/*IntPtr */resultInfo) {
                throw new Error('not implemented')

            },
            GetTypeIdFromResult: function (/*IntPtr */resultInfo) {
                throw new Error('not implemented')

            },
            GetFunctionFromResult: function (/*IntPtr */resultInfo) {
                // resultInfo在webgl模式下固定为1024
                var jsfunc = jsFunctionOrObjectFactory.getOrCreateJSFunction(lastReturnCSResult);
                return getIntPtrManager().GetPointerForJSValue(jsfunc);
            },
            GetJSObjectFromResult: function (/*IntPtr */resultInfo) {
                throw new Error('not implemented')

            },
            GetArrayBufferFromResult: function (/*IntPtr */resultInfo, /*out int */length) {
                throw new Error('not implemented')

            },
            ResetResult: function (/*IntPtr */resultInfo) {
                lastReturnCSResult = null;
            },


            CreateInspector: function (/*IntPtr isolate, int port*/) { },
            DestroyInspector: function (/*IntPtr isolate*/) { },
            InspectorTick: function (/*IntPtr isolate*/) { },
            SetLogCallback: function (/*IntPtr */log, /*IntPtr */logWarning, /*IntPtr */logError) {

            }
        }
    },
};
[
    "SetLastResult",
    "SetLastResultType",
    "GetLibVersion",
    "GetLibBackend",
    "SetGlobalFunction",
    "GetLastExceptionInfo",
    "LowMemoryNotification",
    "SetGeneralDestructor",
    "ExecuteFile",
    "Eval",
    "_RegisterClass",
    "RegisterStruct",
    "RegisterFunction",
    "RegisterProperty",
    "ReturnClass",
    "ReturnObject",
    "ReturnNumber",
    "ReturnString",
    "ReturnBigInt",
    "ReturnBoolean",
    "ReturnDate",
    "ReturnNull",
    "ReturnFunction",
    "ReturnJSObject",
    "ReturnArrayBuffer",
    "GetArgumentType",
    "GetArgumentValue",
    "GetJsValueType",
    "GetTypeIdFromValue",
    "GetNumberFromValue",
    "GetDateFromValue",
    "GetStringFromValue",
    "GetBooleanFromValue",
    "ValueIsBigInt",
    "GetBigIntFromValue",
    "GetObjectFromValue",
    "GetFunctionFromValue",
    "GetJSObjectFromValue",
    "GetArrayBufferFromValue",
    "SetNumberToOutValue",
    "SetDateToOutValue",
    "SetStringToOutValue",
    "SetBooleanToOutValue",
    "SetBigIntToOutValue",
    "SetObjectToOutValue",
    "SetNullToOutValue",
    "SetArrayBufferToOutValue",
    "ThrowException",
    "PushNullForJSFunction",
    "PushDateForJSFunction",
    "PushBooleanForJSFunction",
    "PushBigIntForJSFunction",
    "__PushStringForJSFunction",
    "PushNumberForJSFunction",
    "PushObjectForJSFunction",
    "PushJSFunctionForJSFunction",
    "PushJSObjectForJSFunction",
    "PushArrayBufferForJSFunction",
    "InvokeJSFunction",
    "GetFunctionLastExceptionInfo",
    "ReleaseJSFunction",
    "ReleaseJSObject",
    "GetResultType",
    "GetNumberFromResult",
    "GetDateFromResult",
    "GetStringFromResult",
    "GetBooleanFromResult",
    "ResultIsBigInt",
    "GetBigIntFromResult",
    "GetObjectFromResult",
    "GetTypeIdFromResult",
    "GetFunctionFromResult",
    "GetJSObjectFromResult",
    "GetArrayBufferFromResult",
    "ResetResult",
    "CreateInspector",
    "DestroyInspector",
    "InspectorTick",
    "SetLogCallback"
].forEach(function (methodName) {

    exportDLL[methodName] = new Function("console.log('WebGL DLL:" + methodName + "'); return window.PuertsWebGL['" + methodName + "'].apply(this, arguments)");
})

mergeInto(LibraryManager.library, exportDLL);