
    declare namespace CS {
    //keep type incompatibility / 此属性保持类型不兼容
    const __keep_incompatibility: unique symbol;
    interface $Ref<T> {
        value: T
    }
    namespace System {
        interface Array$1<T> extends System.Array {
            get_Item(index: number):T;
            set_Item(index: number, value: T):void;
        }
    }
    interface $Task<T> {}
    namespace System {
        class Object
        {
            protected [__keep_incompatibility]: never;
        }
        class ValueType extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        class Int32 extends System.ValueType implements System.IEquatable$1<number>, System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<number>, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        interface IEquatable$1<T>
        {
        }
        interface IFormattable
        {
        }
        interface ISpanFormattable
        {
        }
        interface IComparable
        {
        }
        interface IComparable$1<T>
        {
        }
        interface IConvertible
        {
        }
        class Delegate extends System.Object implements System.ICloneable, System.Runtime.Serialization.ISerializable
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICloneable
        {
        }
        interface MulticastDelegate
        { 
        (...args:any[]) : any; 
        Invoke?: (...args:any[]) => any;
        }
        var MulticastDelegate: { new (func: (...args:any[]) => any): MulticastDelegate; }
        interface Func$1<TResult>
        { 
        () : TResult; 
        Invoke?: () => TResult;
        }
        class Void extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
        }
        class String extends System.Object implements System.IEquatable$1<string>, System.ICloneable, System.Collections.Generic.IEnumerable$1<number>, System.IComparable, System.IComparable$1<string>, System.Collections.IEnumerable, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        class Char extends System.ValueType implements System.IEquatable$1<number>, System.IComparable, System.IComparable$1<number>, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        class Boolean extends System.ValueType implements System.IEquatable$1<boolean>, System.IComparable, System.IComparable$1<boolean>, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        interface Func$2<T, TResult>
        { 
        (arg: T) : TResult; 
        Invoke?: (arg: T) => TResult;
        }
        class DateTime extends System.ValueType implements System.IEquatable$1<Date>, System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<Date>, System.IConvertible, System.Runtime.Serialization.ISerializable
        {
            protected [__keep_incompatibility]: never;
        }
        class Int64 extends System.ValueType implements System.IEquatable$1<bigint>, System.IFormattable, System.ISpanFormattable, System.IComparable, System.IComparable$1<bigint>, System.IConvertible
        {
            protected [__keep_incompatibility]: never;
        }
        interface IDisposable
        {
        }
        class Array extends System.Object implements System.Collections.IStructuralComparable, System.Collections.IStructuralEquatable, System.Collections.ICollection, System.ICloneable, System.Collections.IEnumerable, System.Collections.IList
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace PuertsTest {
        class TestStruct extends System.ValueType
        {
            protected [__keep_incompatibility]: never;
            public value : number
            public constructor ($val: number)
        }
        class TestObject extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public value : number
            public constructor ($val: number)
        }
        class TestHelper extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public ReturnAnyTestFunc : System.Func$1<any>
            public static AssertAndPrint ($name: string, $passed: boolean) : void
            public JSFunctionTestPipeLine ($initialValue: System.Func$1<number>, $JSValueHandler: System.Func$2<System.Func$1<number>, System.Func$1<number>>) : System.Func$1<number>
            public NumberTestPipeLine ($initialValue: number, $outArg: $Ref<number>, $JSValueHandler: System.Func$2<number, number>) : number
            public DateTestPipeLine ($initialValue: Date, $outArg: $Ref<Date>, $JSValueHandler: System.Func$2<Date, Date>) : Date
            public StringTestPipeLine ($initialValue: string, $outArg: $Ref<string>, $JSValueHandler: System.Func$2<string, string>) : string
            public BoolTestPipeLine ($initialValue: boolean, $outArg: $Ref<boolean>, $JSValueHandler: System.Func$2<boolean, boolean>) : boolean
            public BigIntTestPipeLine ($initialValue: bigint, $outArg: $Ref<bigint>, $JSValueHandler: System.Func$2<bigint, bigint>) : bigint
            public ArrayBufferTestPipeLine ($initialValue: ArrayBuffer, $outArg: $Ref<ArrayBuffer>, $JSValueHandler: System.Func$2<ArrayBuffer, ArrayBuffer>) : ArrayBuffer
            public NativeObjectTestPipeLine ($initialValue: PuertsTest.TestObject, $outArg: $Ref<PuertsTest.TestObject>, $JSValueHandler: System.Func$2<PuertsTest.TestObject, PuertsTest.TestObject>) : PuertsTest.TestObject
            public NativeObjectStructTestPipeLine ($initialValue: PuertsTest.TestStruct, $outArg: $Ref<PuertsTest.TestStruct>, $JSValueHandler: System.Func$2<PuertsTest.TestStruct, PuertsTest.TestStruct>) : PuertsTest.TestStruct
            public JSObjectTestPipeLine ($initialValue: Puerts.JSObject, $JSValueHandler: System.Func$2<Puerts.JSObject, Puerts.JSObject>) : Puerts.JSObject
            public InvokeReturnAnyTestFunc ($srcValue: PuertsTest.TestStruct) : void
            public constructor ($env: Puerts.JsEnv)
        }
    }
    namespace System.Runtime.Serialization {
        interface ISerializable
        {
        }
    }
    namespace System.Collections.Generic {
        interface IEnumerable$1<T> extends System.Collections.IEnumerable
        {
        }
    }
    namespace System.Collections {
        interface IEnumerable
        {
        }
        interface IStructuralComparable
        {
        }
        interface IStructuralEquatable
        {
        }
        interface ICollection extends System.Collections.IEnumerable
        {
        }
        interface IList extends System.Collections.ICollection, System.Collections.IEnumerable
        {
        }
    }
    namespace Puerts {
        class ArrayBuffer extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        type JSObject = any;
        class JsEnv extends System.Object implements System.IDisposable
        {
            protected [__keep_incompatibility]: never;
        }
    }
}
