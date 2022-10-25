
        window.PUERTS_JS_RESOURCES = {"datatype-test.mjs": (function(exports, require, module, __filename, __dirname) {
            "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = void 0;

const cs = require('csharp');

const assertAndPrint = cs.PuertsTest.TestHelper.AssertAndPrint.bind(cs.PuertsTest.TestHelper);

var init = function (testHelper) {
  debugger;
  const outRef = puerts.$ref(null); // JSFunction

  const oFunc = () => 3;

  testHelper.JSFunctionTestPipeLine(oFunc, function (func) {
    return oFunc;
  }); // Number

  const oNum = 1;
  const rNum = testHelper.NumberTestPipeLine(oNum, outRef, function (num) {
    assertAndPrint("JSGetNumberArgFromCS", num == oNum + 1);
    return oNum + 2;
  });
  assertAndPrint("JSGetNumberOutArgFromCS", puerts.$unref(outRef) == oNum + 3);
  assertAndPrint("JSGetNumberReturnFromCS", rNum == oNum + 4); // Date

  const oDate = new Date("1998-11-11");
  const rDate = testHelper.DateTestPipeLine(oDate, outRef, function (date) {
    assertAndPrint("JSGetDateArgFromCS", date.getTime() == oDate.getTime());
    return oDate;
  });
  assertAndPrint("JSGetDateOutArgFromCS", puerts.$unref(outRef).getTime() == oDate.getTime());
  assertAndPrint("JSGetDateReturnFromCS", rDate.getTime() == oDate.getTime()); // String

  const oString = "abc";
  const rString = testHelper.StringTestPipeLine(oString, outRef, function (str) {
    assertAndPrint("JSGetStringArgFromCS", str == "abcd");
    return "abcde";
  });
  assertAndPrint("JSGetStringOutArgFromCS", puerts.$unref(outRef) == "abcdef");
  assertAndPrint("JSGetStringReturnFromCS", rString == "abcdefg"); // Bool

  const oBool = true;
  const rBool = testHelper.BoolTestPipeLine(oBool, outRef, function (b) {
    assertAndPrint("JSGetBoolArgFromCS", b == false);
    return true;
  });
  assertAndPrint("JSGetBoolOutArgFromCS", puerts.$unref(outRef) == false);
  assertAndPrint("JSGetBoolReturnFromCS", rBool == false); // 2021+ only
  // // BigInt
  // const oBigInt = 9007199254740992n;
  // const rBigInt = testHelper.BigIntTestPipeLine(oBigInt, outRef, function(bi) {
  //     assertAndPrint("JSGetBigIntArgFromCS", bi == oBigInt + 1n);
  //     return oBigInt + 2n
  // });
  // assertAndPrint("JSGetBigIntOutArgFromCS", puerts.$unref(outRef) == oBigInt + 3n);
  // assertAndPrint("JSGetBigIntReturnFromCS", rBigInt == oBigInt + 4n);
  // AB

  const oAB = new Uint8Array([1]).buffer;
  const rAB = testHelper.ArrayBufferTestPipeLine(oAB, outRef, function (bi) {
    assertAndPrint("JSGetArrayBufferArgFromCS", new Uint8Array(bi) == 2);
    return new Uint8Array([3]).buffer;
  });
  assertAndPrint("JSGetArrayBufferOutArgFromCS", new Uint8Array(puerts.$unref(outRef)) == 4);
  assertAndPrint("JSGetArrayBufferReturnFromCS", new Uint8Array(rAB) == 5); // NativeObjectStruct

  const oNativeObjectStruct = new cs.PuertsTest.TestStruct(1);
  const rNativeObjectStruct = testHelper.NativeObjectStructTestPipeLine(oNativeObjectStruct, outRef, function (obj) {
    assertAndPrint("JSGetNativeObjectStructArgFromCS", obj.value == oNativeObjectStruct.value);
    return oNativeObjectStruct;
  });
  assertAndPrint("JSGetNativeObjectStructOutArgFromCS", puerts.$unref(outRef).value == oNativeObjectStruct.value);
  assertAndPrint("JSGetNativeObjectStructReturnFromCS", rNativeObjectStruct.value == oNativeObjectStruct.value); // NativeObject

  const oNativeObject = new cs.PuertsTest.TestObject(1);
  const rNativeObject = testHelper.NativeObjectTestPipeLine(oNativeObject, outRef, function (obj) {
    assertAndPrint("JSGetNativeObjectArgFromCS", obj == oNativeObject);
    return oNativeObject;
  });
  assertAndPrint("JSGetNativeObjectOutArgFromCS", puerts.$unref(outRef) == oNativeObject);
  assertAndPrint("JSGetNativeObjectReturnFromCS", rNativeObject == oNativeObject); // JSObject

  const oJSObject = {
    "puerts": "niubi"
  };
  const rJSObject = testHelper.JSObjectTestPipeLine(oJSObject, function (obj) {
    assertAndPrint("JSGetJSObjectArgFromCS", obj == oJSObject);
    return oJSObject;
  }); // assertAndPrint("JSGetJSObjectOutArgFromCS", puerts.$unref(outRef) == oJSObject);

  assertAndPrint("JSGetJSObjectReturnFromCS", rJSObject == oJSObject);

  testHelper.ReturnAnyTestFunc = () => {
    return new cs.PuertsTest.TestStruct(2);
  };

  testHelper.InvokeReturnAnyTestFunc(new cs.PuertsTest.TestStruct(2));
  debugger;
};

exports.init = init;
        }),"puerts/cjsload.mjs": (function(exports, require, module, __filename, __dirname) {
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

function pathNormalize(path) {
  let reversePathFrags = path.split('/').reverse();
  let newPathFrags = [];

  while (reversePathFrags.length > 0) {
    let el = reversePathFrags.pop();

    if (el != "" && el != ".") {
      if (el == ".." && newPathFrags.length > 0 && newPathFrags[newPathFrags.length - 1] != "..") {
        newPathFrags.pop();
      } else {
        newPathFrags.push(el);
      }
    }
  }

  return newPathFrags.join("/");
}

function searchModuleInDirWithExt(dir, requiredModule) {
  var searchPath = pathNormalize(dir + '/' + requiredModule);

  if (puer.fileExists(searchPath)) {
    return searchPath;
  }

  searchPath = pathNormalize(dir + '/node_modules/' + requiredModule);

  if (puer.fileExists(searchPath)) {
    return searchPath;
  }
}

function getFileExtension(filepath) {
  let last = filepath.split('/').pop();
  let frags = last.split('.');

  if (frags.length > 1) {
    return frags.pop();
  }
}

function searchModuleInDir(dir, requiredModule) {
  if (getFileExtension(requiredModule)) {
    return searchModuleInDirWithExt(dir, requiredModule);
  } else {
    return searchModuleInDirWithExt(dir, requiredModule + ".js") || searchModuleInDirWithExt(dir, requiredModule + ".cjs") || searchModuleInDirWithExt(dir, requiredModule + "/index.js") || searchModuleInDirWithExt(dir, requiredModule + "/package.json");
  }
}

function searchModule(dir, requiredModule) {
  var result = searchModuleInDir(dir, requiredModule);
  if (result) return result;

  if (dir != "" && !requiredModule.endsWith(".js")) {
    let pathFrags = dir.split('/');
    pathFrags.pop();
    pathFrags.unshift('');

    while (pathFrags.length > 0) {
      if (pathFrags[pathFrags.length - 1] != "node_modules") {
        result = searchModuleInDir(pathFrags.join("/"), requiredModule);
        if (result) return result;
      }

      pathFrags.pop();
    }
  }
}

puerts.searchModule = searchModule;
        }),"puerts/csharp.mjs": (function(exports, require, module, __filename, __dirname) {
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
        parentPrototype = Object.getPrototypeOf(currentCls.prototype); // 此处parentPrototype如果是一个泛型，会丢失父父的继承信息，必须循环找下去

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
          let fullName = ntype.FullName.split('`')[0]
          /**.replace(/\+/g, '.') */
          + '$' + ntype.GetGenericArguments().Length;
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
            cache[name] = createTypeProxy(fullName); //console.log(fullName + ' is a namespace');
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
  return {
    value: x
  };
}

function unref(r) {
  return r.value;
}

function setref(x, val) {
  x.value = val;
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
    p.set('$type', puer.loadType(genericTypeInfo.get('$name'), ...genericArgs));
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

puer.$reflectExtension = doExtension;
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
}(); // polyfill old code after use esm module.


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
  let debugPath = {};
  var content = loader.ReadFile(path, debugPath);
  return {
    content: content,
    debugPath: debugPath.value
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

  global.console = console;
  puer.console = console;
}
        }),"puerts/modular.mjs": (function(exports, require, module, __filename, __dirname) {
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

let moduleCache = Object.create(null); // key to sid

let tmpModuleStorage = []; // sid to module

function addModule(m) {
  for (var i = 0; i < tmpModuleStorage.length; i++) {
    if (!tmpModuleStorage[i]) {
      tmpModuleStorage[i] = m;
      return i;
    }
  }

  return tmpModuleStorage.push(m) - 1;
}

function getModuleBySID(id) {
  return tmpModuleStorage[id];
}

let buildinModule = Object.create(null);

function executeModule(fullPath, script, debugPath, sid) {
  sid = typeof sid == 'undefined' ? 0 : sid;
  let fullPathInJs = fullPath.replace(/\\/g, '\\\\');
  let fullDirInJs = fullPath.indexOf('/') != -1 ? fullPath.substring(0, fullPath.lastIndexOf("/")) : fullPath.substring(0, fullPath.lastIndexOf("\\")).replace(/\\/g, '\\\\');
  let exports = {};
  let module = puerts.getModuleBySID(sid);
  module.exports = exports;
  let wrapped = puerts.evalScript( // Wrap the script in the same way NodeJS does it. It is important since IDEs (VSCode) will use this wrapper pattern
  // to enable stepping through original source in-place.
  "(function (exports, require, module, __filename, __dirname) { " + script + "\n});", debugPath);
  wrapped(exports, puerts.genRequire(fullDirInJs), module, fullPathInJs, fullDirInJs);
  return module.exports;
}

function genRequire(requiringDir) {
  if (requiringDir.indexOf(":") != -1) {
    if (requiringDir.startsWith("puer:")) requiringDir = requiringDir.substr(5);else {
      throw new Error("puer's genRequire can only support prefix with puer:");
    }
  }

  let localModuleCache = Object.create(null);

  function require(moduleName) {
    moduleName = moduleName.startsWith('./') ? moduleName.substr(2) : moduleName;
    if (moduleName in localModuleCache) return localModuleCache[moduleName].exports;
    if (moduleName in buildinModule) return buildinModule[moduleName];
    let fullPath = puerts.searchModule(requiringDir, moduleName);

    if (!fullPath) {
      try {
        return nodeRequire(moduleName);
      } catch (e) {
        throw new Error("can not find " + moduleName);
      }
    }

    let key = fullPath;

    if (key in moduleCache) {
      localModuleCache[moduleName] = moduleCache[key];
      return localModuleCache[moduleName].exports;
    }

    let {
      content,
      debugPath
    } = puerts.loadFile(fullPath);
    const script = content;
    let m = {
      "exports": {}
    };
    localModuleCache[moduleName] = m;
    moduleCache[key] = m;
    let sid = addModule(m);

    if (fullPath.endsWith(".json")) {
      let packageConfigure = JSON.parse(script);

      if (fullPath.endsWith("package.json") && packageConfigure.main) {
        let fullDirInJs = fullPath.indexOf('/') != -1 ? fullPath.substring(0, fullPath.lastIndexOf("/")) : fullPath.substring(0, fullPath.lastIndexOf("\\")).replace(/\\/g, '\\\\');
        let tmpRequire = genRequire(fullDirInJs);
        let r = tmpRequire(packageConfigure.main);
        tmpModuleStorage[sid] = undefined;
        m.exports = r;
        return r;
      } else {
        tmpModuleStorage[sid] = undefined;
        m.exports = packageConfigure;
        return packageConfigure;
      }
    } else {
      executeModule(fullPath, script, debugPath, sid);
      tmpModuleStorage[sid] = undefined;
      return m.exports;
    }
  }

  require.clearModuleCache = () => {
    localModuleCache = Object.create(null);
  };

  return require;
}

function registerBuildinModule(name, module) {
  buildinModule[name] = module;
}

registerBuildinModule("puerts", puerts);
registerBuildinModule('csharp', CS);
puerts.genRequire = genRequire;
puerts.getModuleBySID = getModuleBySID;
puerts.registerBuildinModule = registerBuildinModule;
let nodeRequire = global.require;

if (nodeRequire) {
  global.nodeRequire = nodeRequire;
}

global.require = puerts.require = genRequire("");

function clearModuleCache() {
  tmpModuleStorage = [];
  moduleCache = Object.create(null);

  global.require.clearModuleCache();
}

global.clearModuleCache = clearModuleCache;
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
    