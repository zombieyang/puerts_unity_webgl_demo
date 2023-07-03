import str from './lib/importee.mjs';
const assertAndPrint = CS.PuertsTest.TestHelper.AssertAndPrint.bind(CS.PuertsTest.TestHelper);
var init = function (testHelper) {
    debugger;
    assertAndPrint("Import mjs from mjs", str == 'just for test');
    const outRef = puerts.$ref(null);
    // JSFunction
    const oFunc = () => 3;
    testHelper.JSFunctionTestPipeLine(oFunc, function (func) {
        return oFunc;
    });
    // Number
    const oNum = 1;
    const rNum = testHelper.NumberTestPipeLine(oNum, outRef, function (num) {
        assertAndPrint("JSGetNumberArgFromCS", num == oNum + 1);
        return oNum + 2;
    });
    assertAndPrint("JSGetNumberOutArgFromCS", puerts.$unref(outRef) == oNum + 3);
    assertAndPrint("JSGetNumberReturnFromCS", rNum == oNum + 4);
    // String
    const oString = "abc";
    const rString = testHelper.StringTestPipeLine(oString, outRef, function (str) {
        assertAndPrint("JSGetStringArgFromCS", str == "abcd");
        return "abcde";
    });
    assertAndPrint("JSGetStringOutArgFromCS", puerts.$unref(outRef) == "abcdef");
    assertAndPrint("JSGetStringReturnFromCS", rString == "abcdefg");
    // Bool
    const oBool = true;
    const rBool = testHelper.BoolTestPipeLine(oBool, outRef, function (b) {
        assertAndPrint("JSGetBoolArgFromCS", b == false);
        return true;
    });
    assertAndPrint("JSGetBoolOutArgFromCS", puerts.$unref(outRef) == false);
    assertAndPrint("JSGetBoolReturnFromCS", rBool == false);
    // AB
    const oAB = new Uint8Array([1]).buffer;
    const rAB = testHelper.ArrayBufferTestPipeLine(oAB, outRef, function (bi) {
        assertAndPrint("JSGetArrayBufferArgFromCS", new Uint8Array(bi)[0] == 2);
        return new Uint8Array([3]).buffer;
    });
    assertAndPrint("JSGetArrayBufferOutArgFromCS", new Uint8Array(puerts.$unref(outRef))[0] == 4);
    assertAndPrint("JSGetArrayBufferReturnFromCS", new Uint8Array(rAB)[0] == 5);
    // NativeObjectStruct
    const oNativeObjectStruct = new CS.PuertsTest.TestStruct(1);
    const rNativeObjectStruct = testHelper.NativeObjectStructTestPipeLine(oNativeObjectStruct, outRef, function (obj) {
        assertAndPrint("JSGetNativeObjectStructArgFromCS", obj.value == oNativeObjectStruct.value);
        return oNativeObjectStruct;
    });
    assertAndPrint("JSGetNativeObjectStructOutArgFromCS", puerts.$unref(outRef).value == oNativeObjectStruct.value);
    assertAndPrint("JSGetNativeObjectStructReturnFromCS", rNativeObjectStruct.value == oNativeObjectStruct.value);
    // NativeObject
    const oNativeObject = new CS.PuertsTest.TestObject(1);
    const rNativeObject = testHelper.NativeObjectTestPipeLine(oNativeObject, outRef, function (obj) {
        assertAndPrint("JSGetNativeObjectArgFromCS", obj == oNativeObject);
        return oNativeObject;
    });
    assertAndPrint("JSGetNativeObjectOutArgFromCS", puerts.$unref(outRef) == oNativeObject);
    assertAndPrint("JSGetNativeObjectReturnFromCS", rNativeObject == oNativeObject);
    // JSObject
    const oJSObject = { "puerts": "niubi" };
    const rJSObject = testHelper.JSObjectTestPipeLine(oJSObject, function (obj) {
        assertAndPrint("JSGetJSObjectArgFromCS", obj == oJSObject);
        return oJSObject;
    });
    // assertAndPrint("JSGetJSObjectOutArgFromCS", puerts.$unref(outRef) == oJSObject);
    assertAndPrint("JSGetJSObjectReturnFromCS", rJSObject == oJSObject);
    testHelper.ReturnAnyTestFunc = () => {
        return new CS.PuertsTest.TestStruct(2);
    };
    testHelper.InvokeReturnAnyTestFunc(new CS.PuertsTest.TestStruct(2));
    debugger;
};
export { init };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YXR5cGUtdGVzdC5tanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9UeXBlc2NyaXB0cy9kYXRhdHlwZS10ZXN0Lm10cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQztBQUNyQyxNQUFNLGNBQWMsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFOUYsSUFBSSxJQUFJLEdBQUcsVUFBVSxVQUFvQztJQUNyRCxRQUFRLENBQUM7SUFDVCxjQUFjLENBQUMscUJBQXFCLEVBQUUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxDQUFDO0lBRTlELE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFakMsYUFBYTtJQUNiLE1BQU0sS0FBSyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0QixVQUFVLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLFVBQVMsSUFBYztRQUM1RCxPQUFPLEtBQUssQ0FBQTtJQUNoQixDQUFDLENBQUMsQ0FBQztJQUVILFNBQVM7SUFDVCxNQUFNLElBQUksR0FBRyxDQUFDLENBQUM7SUFDZixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFTLEdBQUc7UUFDakUsY0FBYyxDQUFDLHNCQUFzQixFQUFFLEdBQUcsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEQsT0FBTyxJQUFJLEdBQUcsQ0FBQyxDQUFBO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ0gsY0FBYyxDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLGNBQWMs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