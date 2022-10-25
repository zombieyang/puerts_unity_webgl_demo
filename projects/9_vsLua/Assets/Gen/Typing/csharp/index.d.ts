
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
        class Array extends System.Object implements System.Collections.IStructuralComparable, System.Collections.IStructuralEquatable, System.Collections.ICollection, System.ICloneable, System.Collections.IEnumerable, System.Collections.IList
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICloneable
        {
        }
    }
        class PerformanceHelper extends System.Object
        {
            protected [__keep_incompatibility]: never;
            public static JSNumber : UnityEngine.UI.Text
            public static JSVector : UnityEngine.UI.Text
            public static JSFibonacci : UnityEngine.UI.Text
            public static LuaNumber : UnityEngine.UI.Text
            public static LuaVector : UnityEngine.UI.Text
            public static LuaFibonacci : UnityEngine.UI.Text
            public static ReturnNumber ($num: number) : number
            public static ReturnVector ($x: number, $y: number, $z: number) : UnityEngine.Vector3
            public constructor ()
        }
        namespace UnityEngine {
        /** Base class for all objects Unity can reference.
        */
        class Object extends System.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Base class for everything attached to GameObjects.
        */
        class Component extends UnityEngine.Object
        {
            protected [__keep_incompatibility]: never;
        }
        /** Behaviours are Components that can be enabled or disabled.
        */
        class Behaviour extends UnityEngine.Component
        {
            protected [__keep_incompatibility]: never;
        }
        /** MonoBehaviour is the base class from which every Unity script derives.
        */
        class MonoBehaviour extends UnityEngine.Behaviour
        {
            protected [__keep_incompatibility]: never;
        }
        /** Representation of 3D vectors and points.
        */
        class Vector3 extends System.ValueType implements System.IEquatable$1<UnityEngine.Vector3>, System.IFormattable
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.EventSystems {
        class UIBehaviour extends UnityEngine.MonoBehaviour
        {
            protected [__keep_incompatibility]: never;
        }
    }
    namespace UnityEngine.UI {
        class Graphic extends UnityEngine.EventSystems.UIBehaviour implements UnityEngine.UI.ICanvasElement
        {
            protected [__keep_incompatibility]: never;
        }
        interface ICanvasElement
        {
        }
        class MaskableGraphic extends UnityEngine.UI.Graphic implements UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement, UnityEngine.UI.IClippable
        {
            protected [__keep_incompatibility]: never;
        }
        interface IMaterialModifier
        {
        }
        interface IMaskable
        {
        }
        interface IClippable
        {
        }
        class Text extends UnityEngine.UI.MaskableGraphic implements UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement, UnityEngine.UI.ILayoutElement, UnityEngine.UI.IClippable
        {
            protected [__keep_incompatibility]: never;
        }
        interface ILayoutElement
        {
        }
    }
    namespace System.Collections {
        interface IStructuralComparable
        {
        }
        interface IStructuralEquatable
        {
        }
        interface ICollection extends System.Collections.IEnumerable
        {
        }
        interface IEnumerable
        {
        }
        interface IList extends System.Collections.ICollection, System.Collections.IEnumerable
        {
        }
    }
}
declare module 'csharp' {
export = CS;
}
