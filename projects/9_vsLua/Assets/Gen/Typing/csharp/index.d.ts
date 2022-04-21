   
declare module 'csharp' {
    import * as CSharp from 'csharp';
    export default CSharp;
}
declare module 'csharp' {
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
        class PerformanceHelper extends System.Object
        {
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
        namespace System {
        class Object
        {
        }
        class Int32 extends System.ValueType implements System.IComparable, System.IComparable$1<number>, System.IConvertible, System.IEquatable$1<number>, System.IFormattable
        {
        }
        class ValueType extends System.Object
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
        interface IEquatable$1<T>
        {
        }
        interface IFormattable
        {
        }
        class Array extends System.Object implements System.ICloneable, System.Collections.IEnumerable, System.Collections.IList, System.Collections.IStructuralComparable, System.Collections.IStructuralEquatable, System.Collections.ICollection
        {
        }
        interface ICloneable
        {
        }
    }
    namespace UnityEngine.UI {
        class Text extends UnityEngine.UI.MaskableGraphic implements UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement, UnityEngine.UI.ILayoutElement, UnityEngine.UI.IClippable
        {
        }
        class MaskableGraphic extends UnityEngine.UI.Graphic implements UnityEngine.UI.IMaterialModifier, UnityEngine.UI.IMaskable, UnityEngine.UI.ICanvasElement, UnityEngine.UI.IClippable
        {
        }
        class Graphic extends UnityEngine.EventSystems.UIBehaviour implements UnityEngine.UI.ICanvasElement
        {
        }
        interface ICanvasElement
        {
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
        interface ILayoutElement
        {
        }
    }
    namespace UnityEngine.EventSystems {
        class UIBehaviour extends UnityEngine.MonoBehaviour
        {
        }
    }
    namespace UnityEngine {
        /** MonoBehaviour is the base class from which every Unity script derives. */
        class MonoBehaviour extends UnityEngine.Behaviour
        {
        }
        /** Behaviours are Components that can be enabled or disabled. */
        class Behaviour extends UnityEngine.Component
        {
        }
        /** Base class for everything attached to GameObjects. */
        class Component extends UnityEngine.Object
        {
        }
        /** Base class for all objects Unity can reference. */
        class Object extends System.Object
        {
        }
        /** Representation of 3D vectors and points. */
        class Vector3 extends System.ValueType implements System.IEquatable$1<UnityEngine.Vector3>
        {
        }
    }
    namespace System.Collections {
        interface IEnumerable
        {
        }
        interface IList extends System.Collections.IEnumerable, System.Collections.ICollection
        {
        }
        interface ICollection extends System.Collections.IEnumerable
        {
        }
        interface IStructuralComparable
        {
        }
        interface IStructuralEquatable
        {
        }
    }
}
