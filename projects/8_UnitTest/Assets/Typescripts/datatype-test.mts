import str from './lib/importee.mjs';
const assertAndPrint = CS.PuertsTest.TestHelper.AssertAndPrint.bind(CS.PuertsTest.TestHelper);

var init = function (testHelper: CS.PuertsTest.TestHelper) {
    debugger;
    assertAndPrint("Import mjs from mjs", str == 'just for test');

    const outRef = puerts.$ref(null);

    // JSFunction
    const oFunc = () => 3;
    testHelper.JSFunctionTestPipeLine(oFunc, function(func: Function) {
        return oFunc
    });

    // Number
    const oNum = 1;
    const rNum = testHelper.NumberTestPipeLine(oNum, outRef, function(num) {
        assertAndPrint("JSGetNumberArgFromCS", num == oNum + 1);
        return oNum + 2
    });
    assertAndPrint("JSGetNumberOutArgFromCS", puerts.$unref(outRef) == oNum + 3);
    assertAndPrint("JSGetNumberReturnFromCS", rNum == oNum + 4);

    // String
    const oString = "abc";
    const rString = testHelper.StringTestPipeLine(oString, outRef, function(str) {
        assertAndPrint("JSGetStringArgFromCS", str == "abcd");
        return "abcde"
    });
    assertAndPrint("JSGetStringOutArgFromCS", puerts.$unref(outRef) == "abcdef");
    assertAndPrint("JSGetStringReturnFromCS", rString == "abcdefg");

    // Bool
    const oBool = true;
    const rBool = testHelper.BoolTestPipeLine(oBool, outRef, function(b) {
        assertAndPrint("JSGetBoolArgFromCS", b == false);
        return true;
    });
    assertAndPrint("JSGetBoolOutArgFromCS", puerts.$unref(outRef) == false);
    assertAndPrint("JSGetBoolReturnFromCS", rBool == false);

    // AB
    const oAB = new Uint8Array([1]).buffer;
    const rAB = testHelper.ArrayBufferTestPipeLine(oAB, outRef, function(bi) {
        assertAndPrint("JSGetArrayBufferArgFromCS", new Uint8Array(bi)[0] == 2);
        return new Uint8Array([3]).buffer
    });
    assertAndPrint("JSGetArrayBufferOutArgFromCS", new Uint8Array(puerts.$unref(outRef))[0] == 4);
    assertAndPrint("JSGetArrayBufferReturnFromCS", new Uint8Array(rAB)[0] == 5);

    // NativeObjectStruct
    const oNativeObjectStruct = new CS.PuertsTest.TestStruct(1);
    const rNativeObjectStruct = testHelper.NativeObjectStructTestPipeLine(oNativeObjectStruct, outRef, function(obj) {
        assertAndPrint("JSGetNativeObjectStructArgFromCS", obj.value == oNativeObjectStruct.value);
        return oNativeObjectStruct
    });
    assertAndPrint("JSGetNativeObjectStructOutArgFromCS", puerts.$unref(outRef).value == oNativeObjectStruct.value);
    assertAndPrint("JSGetNativeObjectStructReturnFromCS", rNativeObjectStruct.value == oNativeObjectStruct.value);

    // NativeObject
    const oNativeObject = new CS.PuertsTest.TestObject(1);
    const rNativeObject = testHelper.NativeObjectTestPipeLine(oNativeObject, outRef, function(obj) {
        assertAndPrint("JSGetNativeObjectArgFromCS", obj == oNativeObject);
        return oNativeObject
    });
    assertAndPrint("JSGetNativeObjectOutArgFromCS", puerts.$unref(outRef) == oNativeObject);
    assertAndPrint("JSGetNativeObjectReturnFromCS", rNativeObject == oNativeObject);

    // JSObject
    const oJSObject = { "puerts": "niubi" };
    const rJSObject = testHelper.JSObjectTestPipeLine(oJSObject, function(obj) {
        assertAndPrint("JSGetJSObjectArgFromCS", obj == oJSObject);
        return oJSObject
    });
    // assertAndPrint("JSGetJSObjectOutArgFromCS", puerts.$unref(outRef) == oJSObject);
    assertAndPrint("JSGetJSObjectReturnFromCS", rJSObject == oJSObject);

    // ref
    const refNativeObject = puerts.$ref(null);
    testHelper.RefTestPipeLine(refNativeObject, function (obj) {
        assertAndPrint("JSGetRefArgFromCS1", obj.value === 3);
        return obj.value;
    });
    testHelper.RefTestPipeLine(refNativeObject, function (obj) {
        assertAndPrint("JSGetRefArgFromCS2", obj.value === 4);
        return obj.value;
    });
    assertAndPrint("JSGetRefOutArgFromCS", puerts.$unref(refNativeObject).value === 4);

    testHelper.ReturnAnyTestFunc = ()=>{
        return new CS.PuertsTest.TestStruct(2);
    }
    testHelper.InvokeReturnAnyTestFunc(new CS.PuertsTest.TestStruct(2));

    debugger;
};

export { init };
