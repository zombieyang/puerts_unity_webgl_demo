
        window.PUERTS_JS_RESOURCES = {"puerts/csharp.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || function () {
  return this;
}();
function csTypeToClass(csType) {
  let cls = puer.loadType(csType);
  if (cls) {
    let currentCls = cls,
      parentPrototype = Object.getPrototypeOf(currentCls.prototype);

    // 此处parentPrototype如果是一个泛型，会丢失父父的继承信息，必须循环找下去
    while (parentPrototype) {
      Object.setPrototypeOf(currentCls, parentPrototype.constructor); //v8 api的inherit并不能把静态属性也继承，通过这种方式修复下
      currentCls.__static_inherit__ = true;
      currentCls = parentPrototype.constructor;
      parentPrototype = Object.getPrototypeOf(currentCls.prototype);
      if (currentCls === Object || currentCls === Function || currentCls.__static_inherit__) break;
    }
    let readonlyStaticMembers;
    if (readonlyStaticMembers = cls.__puertsMetadata.get('readonlyStaticMembers')) {
      for (var key in cls) {
        let desc = Object.getOwnPropertyDescriptor(cls, key);
        if (readonlyStaticMembers.has(key) && desc && typeof desc.get == 'function' && typeof desc.value == 'undefined') {
          let getter = desc.get;
          let value;
          let valueGetted = false;
          Object.defineProperty(cls, key, Object.assign(desc, {
            get() {
              if (!valueGetted) {
                value = getter();
                valueGetted = true;
              }
              return value;
            },
            configurable: false
          }));
          if (cls.__p_isEnum) {
            const val = cls[key];
            if (typeof val == 'number') {
              cls[val] = key;
            }
          }
        }
      }
    }
    let nestedTypes = puer.getNestedTypes(csType);
    if (nestedTypes) {
      for (var i = 0; i < nestedTypes.Length; i++) {
        let ntype = nestedTypes.get_Item(i);
        if (ntype.IsGenericType) {
          let name = ntype.Name.split('`')[0] + '$' + ntype.GetGenericArguments().Length;
          let fullName = ntype.FullName.split('`')[0] /**.replace(/\+/g, '.') */ + '$' + ntype.GetGenericArguments().Length;
          let genericTypeInfo = cls[name] = new Map();
          genericTypeInfo.set('$name', fullName.replace('$', '`'));
        } else {
          cls[ntype.Name] = csTypeToClass(ntype);
        }
      }
    }
  }
  return cls;
}
function Namespace() {}
puer.__$NamespaceType = Namespace;
function createTypeProxy(namespace) {
  return new Proxy(new Namespace(), {
    get: function (cache, name) {
      if (!(name in cache)) {
        let fullName = namespace ? namespace + '.' + name : name;
        if (/\$\d+$/.test(name)) {
          let genericTypeInfo = cache[name] = new Map();
          genericTypeInfo.set('$name', fullName.replace('$', '`'));
        } else {
          let cls = csTypeToClass(fullName);
          if (cls) {
            cache[name] = cls;
          } else {
            cache[name] = createTypeProxy(fullName);
            //console.log(fullName + ' is a namespace');
          }
        }
      }

      return cache[name];
    }
  });
}
let csharpModule = createTypeProxy(undefined);
csharpModule.default = csharpModule;
global.CS = csharpModule;
csharpModule.System.Object.prototype.toString = csharpModule.System.Object.prototype.ToString;
function ref(x) {
  return [x];
}
function unref(r) {
  return r[0];
}
function setref(x, val) {
  x[0] = val;
}
function taskToPromise(task) {
  return new Promise((resolve, reject) => {
    task.GetAwaiter().UnsafeOnCompleted(() => {
      let t = task;
      task = undefined;
      if (t.IsFaulted) {
        if (t.Exception) {
          if (t.Exception.InnerException) {
            reject(t.Exception.InnerException.Message);
          } else {
            reject(t.Exception.Message);
          }
        } else {
          reject("unknow exception!");
        }
      } else {
        resolve(t.Result);
      }
    });
  });
}
function genIterator(obj) {
  let it = obj.GetEnumerator();
  return {
    next() {
      if (it.MoveNext()) {
        return {
          value: it.Current,
          done: false
        };
      }
      it.Dispose();
      return {
        value: null,
        done: true
      };
    }
  };
}
function makeGeneric(genericTypeInfo, ...genericArgs) {
  let p = genericTypeInfo;
  for (var i = 0; i < genericArgs.length; i++) {
    let genericArg = genericArgs[i];
    if (!p.has(genericArg)) {
      p.set(genericArg, new Map());
    }
    p = p.get(genericArg);
  }
  if (!p.has('$type')) {
    let typName = genericTypeInfo.get('$name');
    let typ = puer.loadType(typName, ...genericArgs);
    if (getType(csharpModule.System.Collections.IEnumerable).IsAssignableFrom(getType(typ))) {
      typ.prototype[Symbol.iterator] = function () {
        return genIterator(this);
      };
    }
    p.set('$type', typ);
  }
  return p.get('$type');
}
function makeGenericMethod(cls, methodName, ...genericArgs) {
  if (cls && typeof methodName == 'string' && genericArgs && genericArgs.length > 0) {
    return puer.getGenericMethod(puer.$typeof(cls), methodName, ...genericArgs);
  } else {
    throw new Error("invalid arguments for makeGenericMethod");
  }
}
function getType(cls) {
  return cls.__p_innerType;
}
function bindThisToFirstArgument(func, parentFunc) {
  if (parentFunc) {
    return function (...args) {
      try {
        return func.apply(null, [this, ...args]);
      } catch {
        return parentFunc.call(this, ...args);
      }
      ;
    };
  }
  return function (...args) {
    return func.apply(null, [this, ...args]);
  };
}
function doExtension(cls, extension) {
  // if you already generate static wrap for cls and extension, then you are no need to invoke this function
  // 如果你已经为extension和cls生成静态wrap，则不需要调用这个函数。
  var parentPrototype = Object.getPrototypeOf(cls.prototype);
  Object.keys(extension).forEach(key => {
    var func = extension[key];
    if (typeof func == 'function' && key != 'constructor' && !(key in cls.prototype)) {
      var parentFunc = parentPrototype ? parentPrototype[key] : undefined;
      parentFunc = typeof parentFunc === "function" ? parentFunc : undefined;
      Object.defineProperty(cls.prototype, key, {
        value: bindThisToFirstArgument(func, parentFunc),
        writable: false,
        configurable: false
      });
    }
  });
}
puer.$ref = ref;
puer.$unref = unref;
puer.$set = setref;
puer.$promise = taskToPromise;
puer.$generic = makeGeneric;
puer.$genericMethod = makeGenericMethod;
puer.$typeof = getType;
puer.$extension = (cls, extension) => {
  typeof console != 'undefined' && console.warn(`deprecated! if you already generate static wrap for ${cls} and ${extension}, you are no need to invoke $extension`);
  return doExtension(cls, extension);
};
        }),"puerts/dispose.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = resetAllFunctionWhenDisposed;
var global = global || globalThis || function () {
  return this;
}();
function resetAllFunctionWhenDisposed() {
  global.puer.disposed = true;
  const PuerIsDisposed = function () {
    throw new Error('puerts has disposed');
  };
  puer.loadType = PuerIsDisposed;
  puer.getNestedTypes = PuerIsDisposed;
  try {
    setToGoodbyeFuncRecursive(CS);
  } catch (e) {}
  function setToGoodbyeFuncRecursive(obj) {
    Object.keys(obj).forEach(key => {
      if (obj[key] == obj) {
        return; // a member named default is the obj itself which is in the root
      }

      setToGoodbyeFuncRecursive(obj[key]);
      if (typeof obj[key] == 'function' && obj[key].prototype) {
        const prototype = obj[key].prototype;
        Object.keys(prototype).forEach(pkey => {
          if (Object.getOwnPropertyDescriptor(prototype, pkey).configurable) {
            Object.defineProperty(prototype, pkey, {
              get: PuerIsDisposed,
              set: PuerIsDisposed
            });
          }
        });
        Object.keys(obj[key]).forEach(skey => {
          if (Object.getOwnPropertyDescriptor(obj[key], skey).configurable) {
            Object.defineProperty(obj[key], skey, {
              get: PuerIsDisposed,
              set: PuerIsDisposed
            });
          }
        });
      }
      if (obj[key] instanceof puer.__$NamespaceType) {
        Object.defineProperty(obj, key, {
          get: PuerIsDisposed,
          set: PuerIsDisposed
        });
      }
    });
  }
}
        }),"puerts/events.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
* Tencent is pleased to support the open source community by making Puerts available.
* Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
* Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
* This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
*/

var global = global || globalThis || function () {
  return this;
}();
let events = Object.create(null);
let eventsCount = 0;
function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new Error('listener expect a function');
  }
}
function on(type, listener, prepend) {
  checkListener(listener);
  let existing = events[type];
  if (existing === undefined) {
    events[type] = listener;
    ++eventsCount;
  } else {
    if (typeof existing === 'function') {
      events[type] = prepend ? [listener, existing] : [existing, listener];
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }
  }
}
function off(type, listener) {
  checkListener(listener);
  const list = events[type];
  if (list === undefined) return;
  if (list === listener) {
    if (--eventsCount === 0) events = Object.create(null);else {
      delete events[type];
    }
  } else if (typeof list !== 'function') {
    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i] === listener) {
        //found
        if (i === 0) list.shift();else {
          spliceOne(list, i);
        }
        if (list.length === 1) events[type] = list[0];
        break;
      }
    }
  }
}
function emit(type, ...args) {
  const listener = events[type];
  if (listener === undefined) return false;
  if (typeof listener === 'function') {
    Reflect.apply(listener, this, args);
  } else {
    const len = listener.length;
    const listeners = arrayClone(listener, len);
    for (var i = 0; i < len; ++i) Reflect.apply(listeners[i], this, args);
  }
  return true;
}
function arrayClone(arr, n) {
  const copy = new Array(n);
  for (var i = 0; i < n; ++i) copy[i] = arr[i];
  return copy;
}
function spliceOne(list, index) {
  for (; index + 1 < list.length; index++) list[index] = list[index + 1];
  list.pop();
}
puer.on = on;
puer.off = off;
puer.emit = emit;
        }),"puerts/init_il2cpp.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || function () {
  return this;
}();
// polyfill old code after use esm module.
global.global = global;
let puer = global.puer = global.puerts = global.puer || global.puerts || {};
puer.loadType = function (nameOrCSType, ...genericArgs) {
  let csType = nameOrCSType;
  if (typeof nameOrCSType == "string") {
    // convert string to csType
    csType = jsEnv.GetTypeByString(nameOrCSType);
  }
  if (csType) {
    if (genericArgs && csType.IsGenericTypeDefinition) {
      genericArgs = genericArgs.map(g => puer.$typeof(g));
      csType = csType.MakeGenericType(...genericArgs);
    }
    let cls = loadType(csType);
    cls.__p_innerType = csType;
    // todo
    cls.__puertsMetadata = cls.__puertsMetadata || new Map();
    return cls;
  }
};
let BindingFlags = puer.loadType("System.Reflection.BindingFlags");
let GET_MEMBER_FLAGS = BindingFlags.DeclaredOnly | BindingFlags.Instance | BindingFlags.Static | BindingFlags.Public;
puer.getNestedTypes = function (nameOrCSType) {
  let csType = nameOrCSType;
  if (typeof nameOrCSType == "string") {
    csType = jsEnv.GetTypeByString(nameOrCSType);
  }
  if (csType) {
    return csType.GetNestedTypes(GET_MEMBER_FLAGS);
  }
};
function jsArrToCsArr(jsarr, type) {
  type = type || puer.$typeof(CS.System.Object);
  let arr = CS.System.Array.CreateInstance(type, jsarr.length);
  for (let i = 0; i < arr.Length; i++) {
    arr.SetValue(jsarr[i], i);
  }
  return arr;
}
let MemberTypes = puer.loadType("System.Reflection.MemberTypes");
let MemberTypes_Method = MemberTypes.Method;
let GENERIC_INVOKE_ERR_ARG_CHECK_FAILED = {};
let ARG_FLAG_OUT = 0x01;
let ARG_FLAG_REF = 0x02;
puer.getGenericMethod = function (csType, methodName, ...genericArgs) {
  if (typeof csType.GetMember != 'function') {
    throw new Error('the class must be a constructor');
  }
  let members = csType.GetMember(methodName, MemberTypes_Method, GET_MEMBER_FLAGS);
  let overloadFunctions = [];
  for (let i = 0; i < members.Length; i++) {
    let method = members.GetValue(i);
    if (method.IsGenericMethodDefinition && method.GetGenericArguments().Length == genericArgs.length) {
      let methodImpl = method.MakeGenericMethod(...genericArgs.map((x, index) => {
        const ret = puer.$typeof(x);
        if (!ret) {
          throw new Error("invalid Type for generic arguments " + index);
        }
        return ret;
      }));
      overloadFunctions.push(methodImpl);
    }
  }
  let overloadCount = overloadFunctions.length;
  if (overloadCount == 0) {
    console.error("puer.getGenericMethod not found", csType.Name, methodName, genericArgs.map(x => puer.$typeof(x).Name).join(","));
    return null;
  }
  let createOverloadFunctionWrap = function (method) {
    let typeof_System_Object = puer.$typeof(CS.System.Object);
    let paramDefs = method.GetParameters();
    let needArgCount = paramDefs.Length;
    let argFlags = needArgCount > 0 ? [] : null;
    let needArgTypeCode = needArgCount > 0 ? [] : null;
    for (let i = 0; i < paramDefs.Length; i++) {
      let paramDef = paramDefs.GetValue(i);
      let paramType = paramDef.ParameterType;
      if (paramDef.IsOut) argFlags[i] = (argFlags[i] ?? 0) | ARG_FLAG_OUT;
      if (paramType.IsByRef) {
        argFlags[i] = (argFlags[i] ?? 0) | ARG_FLAG_REF;
        needArgTypeCode[i] = CS.System.Type.GetTypeCode(paramType.GetElementType());
      } else {
        needArgTypeCode[i] = CS.System.Type.GetTypeCode(paramType);
      }
    }
    let argsCsArr;
    let checkArgs = function (...args) {
      if (needArgCount != (args ? args.length : 0)) return GENERIC_INVOKE_ERR_ARG_CHECK_FAILED;
      if (needArgCount == 0) return null;
      argsCsArr = argsCsArr ?? CS.System.Array.CreateInstance(typeof_System_Object, needArgCount);
      // set args to c# array
      for (let i = 0; i < needArgCount; i++) {
        let val = argFlags[i] & ARG_FLAG_REF ? argFlags[i] & ARG_FLAG_OUT ? null : puer.$unref(args[i]) : args[i];
        let jsValType = typeof val;
        if (jsValType === "number" || jsValType == 'bigint') {
          argsCsArr.set_Item(i, createTypedValueByTypeCode(val, needArgTypeCode[i]));
        } else {
          argsCsArr.set_Item(i, val);
        }
      }
      return argsCsArr;
    };
    let invoke = function (...args) {
      let argscs = checkArgs(...args);
      if (argscs === GENERIC_INVOKE_ERR_ARG_CHECK_FAILED) return overloadCount == 1 ? undefined : GENERIC_INVOKE_ERR_ARG_CHECK_FAILED;
      let ret = method.Invoke(this, 0, null, argscs, null);
      // set args to js array for ref type
      if (argFlags) {
        for (let i = 0; i < argFlags.length; i++) {
          if (argFlags[i] & ARG_FLAG_REF) args[i][0] = argscs.GetValue(i);
        }
      }
      return ret;
    };
    return invoke;
  };
  let invokes = overloadFunctions.map(x => createOverloadFunctionWrap(x));
  if (overloadCount == 1) {
    return invokes[0];
  } else {
    return function (...args) {
      for (let i = 0; i < invokes.length; i++) {
        let ret = invokes[i].call(this, ...args);
        if (ret === GENERIC_INVOKE_ERR_ARG_CHECK_FAILED) continue;
        return ret;
      }
      console.error("puer.getGenericMethod.overloadfunctions.invoke no match overload");
    };
  }
};
puer.getLastException = function () {
  // todo
};
puer.evalScript = eval;
let loader = jsEnv.GetLoader();
// function loadFile(path) {
//     let resolved, content
//     if (resolved = loader.Resolve(path)) {
//         let contents = []
//         loader.ReadFile(resolved, contents);
//         content = contents[0]
//     }
//     return { content: content, debugPath: resolved };
// }
// puer.loadFile = loadFile;

// puer.fileExists = loader.Resolve.bind(loader);
function loadFile(path) {
  let debugPath = {};
  var content = loader.ReadFile(path, debugPath);
  return {
    content: content,
    debugPath: debugPath.value
  };
}
puer.loadFile = loadFile;
puer.fileExists = loader.FileExists.bind(loader);
global.__tgjsRegisterTickHandler = function (fn) {
  fn = new CS.System.Action(fn);
  jsEnv.TickHandler = CS.System.Delegate.Combine(jsEnv.TickHandler, fn);
};
function createTypedValueByTypeCode(value, typecode) {
  switch (typecode) {
    case CS.System.TypeCode.Char:
      return new CS.Puerts.CharValue(value);
    case CS.System.TypeCode.SByte:
      return new CS.Puerts.SByteValue(value);
    case CS.System.TypeCode.Byte:
      return new CS.Puerts.ByteValue(value);
    case CS.System.TypeCode.Int16:
      return new CS.Puerts.Int16Value(value);
    case CS.System.TypeCode.UInt16:
      return new CS.Puerts.UInt16Value(value);
    case CS.System.TypeCode.Int32:
      return new CS.Puerts.Int32Value(value);
    case CS.System.TypeCode.UInt32:
      return new CS.Puerts.UInt32Value(value);
    case CS.System.TypeCode.Int64:
      return new CS.Puerts.Int64Value(value);
    case CS.System.TypeCode.UInt64:
      return new CS.Puerts.UInt64Value(value);
    case CS.System.TypeCode.Single:
      return new CS.Puerts.FloatValue(value);
    case CS.System.TypeCode.Double:
      return new CS.Puerts.DoubleValue(value);
    default:
      return value;
  }
}
        }),"puerts/init.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || function () {
  return this;
}();
// polyfill old code after use esm module.
global.global = global;
let puer = global.puer = global.puerts = global.puer || global.puerts || {};
puer.loadType = global.__tgjsLoadType;
delete global.__tgjsLoadType;
puer.getNestedTypes = global.__tgjsGetNestedTypes;
delete global.__tgjsGetNestedTypes;
puer.getGenericMethod = global.__tgjsGetGenericMethod;
delete global.__tgjsGetGenericMethod;
puer.evalScript = global.__tgjsEvalScript || function (script, debugPath) {
  return eval(script);
};
delete global.__tgjsEvalScript;
puer.getLastException = global.__puertsGetLastException;
delete global.__puertsGetLastException;
let loader = global.__tgjsGetLoader();
delete global.__tgjsGetLoader;
function loadFile(path) {
  let debugPath = [];
  var content = loader.ReadFile(path, debugPath);
  return {
    content: content,
    debugPath: debugPath[0]
  };
}
puer.loadFile = loadFile;
puer.fileExists = loader.FileExists.bind(loader);
        }),"puerts/log.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || function () {
  return this;
}();
let UnityEngine_Debug = puer.loadType('UnityEngine.Debug');
if (UnityEngine_Debug) {
  const console_org = global.console;
  var console = {};
  function toString(args) {
    return Array.prototype.map.call(args, x => {
      try {
        return x instanceof Error ? x.stack : x + '';
      } catch (err) {
        return err;
      }
    }).join(',');
  }
  function getStack(error) {
    let stack = error.stack; // get js stack
    stack = stack.substring(stack.indexOf("\n") + 1); // remove first line ("Error")
    stack = stack.replace(/^ {4}/gm, ""); // remove indentation
    return stack;
  }
  console.log = function () {
    if (console_org) console_org.log.apply(null, Array.prototype.slice.call(arguments));
    UnityEngine_Debug.Log(toString(arguments));
  };
  console.info = function () {
    if (console_org) console_org.info.apply(null, Array.prototype.slice.call(arguments));
    UnityEngine_Debug.Log(toString(arguments));
  };
  console.warn = function () {
    if (console_org) console_org.warn.apply(null, Array.prototype.slice.call(arguments));
    UnityEngine_Debug.LogWarning(toString(arguments));
  };
  console.error = function () {
    if (console_org) console_org.error.apply(null, Array.prototype.slice.call(arguments));
    UnityEngine_Debug.LogError(toString(arguments));
  };
  console.trace = function () {
    if (console_org) console_org.trace.apply(null, Array.prototype.slice.call(arguments));
    UnityEngine_Debug.Log(toString(arguments) + "\n" + getStack(new Error()) + "\n");
  };
  console.assert = function (condition) {
    if (console_org) console_org.assert.apply(null, Array.prototype.slice.call(arguments));
    if (condition) return;
    if (arguments.length > 1) UnityEngine_Debug.Assert(false, "Assertion failed: " + toString(Array.prototype.slice.call(arguments, 1)) + "\n" + getStack(new Error()) + "\n");else UnityEngine_Debug.Assert(false, "Assertion failed: console.assert\n" + getStack(new Error()) + "\n");
  };
  const timeRecorder = new Map();
  console.time = function (name) {
    timeRecorder.set(name, +new Date());
  };
  console.timeEnd = function (name) {
    const startTime = timeRecorder.get(name);
    if (startTime) {
      console.log(String(name) + ": " + (+new Date() - startTime) + " ms");
      timeRecorder.delete(name);
    } else {
      console.warn("Timer '" + String(name) + "' does not exist");
    }
    ;
  };
  global.console = console;
  puer.console = console;
}
        }),"puerts/nodepatch.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
* Tencent is pleased to support the open source community by making Puerts available.
* Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
* Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms.
* This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
*/

process.on('uncaughtException', e => {
  console.error(e);
});
process.exit = function () {
  console.log('`process.exit` is not allowed in puerts');
};
process.kill = function () {
  console.log('`process.kill` is not allowed in puerts');
};
const customPromisify = require('util').promisify.custom;
Object.defineProperty(setTimeout, customPromisify, {
  enumerable: true,
  get() {
    return function (delay) {
      return new Promise(resolve => setTimeout(resolve, delay));
    };
  }
});
globalThis.setImmediate = function (fn) {
  return setTimeout(fn, 0);
};
globalThis.clearImmediate = function (fn) {
  clearTimeout(fn);
};
        }),"puerts/polyfill.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
* Tencent is pleased to support the open source community by making Puerts available.
* Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
* Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms.
* This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
*/

var global = global || globalThis || function () {
  return this;
}();
global.process = {
  env: {
    NODE_ENV: 'development'
  }
};
        }),"puerts/promises.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
 * Tencent is pleased to support the open source community by making Puerts available.
 * Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
 * Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
 * This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
 */

var global = global || globalThis || function () {
  return this;
}();
const kPromiseRejectWithNoHandler = 0;
const kPromiseHandlerAddedAfterReject = 1;
const kPromiseRejectAfterResolved = 2;
const kPromiseResolveAfterResolved = 3;
global.__tgjsSetPromiseRejectCallback(promiseRejectHandler);
delete global.__tgjsSetPromiseRejectCallback;
const maybeUnhandledRejection = new WeakMap();
function promiseRejectHandler(type, promise, reason) {
  switch (type) {
    case kPromiseRejectWithNoHandler:
      maybeUnhandledRejection.set(promise, {
        reason
      }); //maybe unhandledRejection
      Promise.resolve().then(() => Promise.resolve()) // run after all microtasks
      .then(_ => unhandledRejection(promise, reason));
      break;
    case kPromiseHandlerAddedAfterReject:
      handlerAddedAfterReject(promise);
      break;
    case kPromiseResolveAfterResolved:
      console.error('kPromiseResolveAfterResolved', promise, reason);
      break;
    case kPromiseRejectAfterResolved:
      console.error('kPromiseRejectAfterResolved', promise, reason);
      break;
  }
}
function unhandledRejection(promise, reason) {
  const promiseInfo = maybeUnhandledRejection.get(promise);
  if (promiseInfo === undefined) {
    return;
  }
  if (!puer.emit('unhandledRejection', promiseInfo.reason, promise)) {
    unhandledRejectionWarning(reason);
  }
}
function unhandledRejectionWarning(reason) {
  try {
    if (reason instanceof Error) {
      console.warn('unhandledRejection', reason, reason.stack);
    } else {
      console.warn('unhandledRejection', reason);
    }
  } catch {}
}
function handlerAddedAfterReject(promise) {
  const promiseInfo = maybeUnhandledRejection.get(promise);
  if (promiseInfo !== undefined) {
    // cancel
    maybeUnhandledRejection.delete(promise);
  }
}
        }),"puerts/timer.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

/*
* Tencent is pleased to support the open source community by making Puerts available.
* Copyright (C) 2020 THL A29 Limited, a Tencent company.  All rights reserved.
* Puerts is licensed under the BSD 3-Clause License, except for the third-party components listed in the file 'LICENSE' which may be subject to their corresponding license terms. 
* This file is subject to the terms and conditions defined in file 'LICENSE', which is part of this source code package.
*/

var global = global || globalThis || function () {
  return this;
}();
class PriorityQueue {
  constructor(data = [], compare = (a, b) => a - b) {
    this.data = data;
    this.length = this.data.length;
    this.compare = compare;
    if (this.length > 0) {
      for (let i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
    }
  }
  push(item) {
    this.data.push(item);
    this.length++;
    this._up(this.length - 1);
  }
  pop() {
    if (this.length === 0) return undefined;
    const top = this.data[0];
    const bottom = this.data.pop();
    this.length--;
    if (this.length > 0) {
      this.data[0] = bottom;
      this._down(0);
    }
    return top;
  }
  peek() {
    return this.data[0];
  }
  _up(pos) {
    const {
      data,
      compare
    } = this;
    const item = data[pos];
    while (pos > 0) {
      const parent = pos - 1 >> 1;
      const current = data[parent];
      if (compare(item, current) >= 0) break;
      data[pos] = current;
      pos = parent;
    }
    data[pos] = item;
  }
  _down(pos) {
    const {
      data,
      compare
    } = this;
    const halfLength = this.length >> 1;
    const item = data[pos];
    while (pos < halfLength) {
      let left = (pos << 1) + 1;
      let best = data[left];
      const right = left + 1;
      if (right < this.length && compare(data[right], best) < 0) {
        left = right;
        best = data[right];
      }
      if (compare(best, item) >= 0) break;
      data[pos] = best;
      pos = left;
    }
    data[pos] = item;
  }
}
const removing_timers = new Set();
const timers = new PriorityQueue([], (a, b) => a.next_time - b.next_time);
let next = 0;
global.__tgjsRegisterTickHandler(timerUpdate);
delete global.__tgjsRegisterTickHandler;
function timerUpdate() {
  let now = null;
  while (true) {
    const time = timers.peek();
    if (!time) {
      break;
    }
    if (!now) {
      now = Date.now();
    }
    if (time.next_time <= now) {
      timers.pop();
      if (removing_timers.has(time.id)) {
        removing_timers.delete(time.id);
      } else {
        if (time.timeout) {
          time.next_time = now + time.timeout;
          timers.push(time);
        }
        time.handler(...time.args);
      }
    } else {
      break;
    }
  }
}
global.setTimeout = (fn, time, ...arg) => {
  if (typeof fn !== 'function') {
    throw new Error(`Callback must be a function. Received ${typeof fn}`);
  }
  let t = 0;
  if (time > 0) t = time;
  timers.push({
    id: ++next,
    next_time: t + Date.now(),
    args: arg,
    handler: fn
  });
  return next;
};
global.setInterval = (fn, time, ...arg) => {
  if (typeof fn !== 'function') {
    throw new Error(`Callback must be a function. Received ${typeof fn}`);
  }
  let t = 10;
  if (time != null && time > 10) t = time;
  timers.push({
    id: ++next,
    next_time: t + Date.now(),
    handler: fn,
    args: arg,
    timeout: t
  });
  return next;
};
global.clearInterval = id => {
  removing_timers.add(id);
};
global.clearTimeout = global.clearInterval;
        })};
    