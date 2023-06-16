using Puerts.TypeMapping;
using Puerts;

namespace PuertsStaticWrap
{
#if ENABLE_IL2CPP
    [UnityEngine.Scripting.Preserve]
#endif
    public static class PuerRegisterInfo_Gen
    {
        
        public static RegisterInfo GetRegisterInfo_PerformanceHelper_Wrap() 
        {
            return new RegisterInfo 
            {
#if !EXPERIMENTAL_IL2CPP_PUERTS || !ENABLE_IL2CPP
                BlittableCopy = false,
#endif
                Members = new System.Collections.Generic.Dictionary<string, MemberRegisterInfo>
                {
                    
                    {".ctor", new MemberRegisterInfo { Name = ".ctor", IsStatic = false, MemberType = MemberType.Constructor, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Constructor = PerformanceHelper_Wrap.Constructor
#endif
                    }},
                    {"ReturnNumber_static", new MemberRegisterInfo { Name = "ReturnNumber", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = PerformanceHelper_Wrap.F_ReturnNumber
#endif
                    }},
                    {"ReturnVector_static", new MemberRegisterInfo { Name = "ReturnVector", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = PerformanceHelper_Wrap.F_ReturnVector
#endif
                    }},
                    {"JSNumber_static", new MemberRegisterInfo { Name = "JSNumber", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_JSNumber, PropertySetter = PerformanceHelper_Wrap.S_JSNumber
#endif
                    }},
                    {"JSVector_static", new MemberRegisterInfo { Name = "JSVector", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_JSVector, PropertySetter = PerformanceHelper_Wrap.S_JSVector
#endif
                    }},
                    {"JSFibonacci_static", new MemberRegisterInfo { Name = "JSFibonacci", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_JSFibonacci, PropertySetter = PerformanceHelper_Wrap.S_JSFibonacci
#endif
                    }},
                    {"LuaNumber_static", new MemberRegisterInfo { Name = "LuaNumber", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_LuaNumber, PropertySetter = PerformanceHelper_Wrap.S_LuaNumber
#endif
                    }},
                    {"LuaVector_static", new MemberRegisterInfo { Name = "LuaVector", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_LuaVector, PropertySetter = PerformanceHelper_Wrap.S_LuaVector
#endif
                    }},
                    {"LuaFibonacci_static", new MemberRegisterInfo { Name = "LuaFibonacci", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = PerformanceHelper_Wrap.G_LuaFibonacci, PropertySetter = PerformanceHelper_Wrap.S_LuaFibonacci
#endif
                    }},
                }
            };
        }
        public static RegisterInfo GetRegisterInfo_System_Type_Wrap() 
        {
            return new RegisterInfo 
            {
#if !EXPERIMENTAL_IL2CPP_PUERTS || !ENABLE_IL2CPP
                BlittableCopy = false,
#endif
                Members = new System.Collections.Generic.Dictionary<string, MemberRegisterInfo>
                {
                    
                    {"IsEnumDefined", new MemberRegisterInfo { Name = "IsEnumDefined", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_IsEnumDefined
#endif
                    }},
                    {"GetEnumName", new MemberRegisterInfo { Name = "GetEnumName", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEnumName
#endif
                    }},
                    {"GetEnumNames", new MemberRegisterInfo { Name = "GetEnumNames", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEnumNames
#endif
                    }},
                    {"FindInterfaces", new MemberRegisterInfo { Name = "FindInterfaces", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_FindInterfaces
#endif
                    }},
                    {"FindMembers", new MemberRegisterInfo { Name = "FindMembers", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_FindMembers
#endif
                    }},
                    {"IsSubclassOf", new MemberRegisterInfo { Name = "IsSubclassOf", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_IsSubclassOf
#endif
                    }},
                    {"IsAssignableFrom", new MemberRegisterInfo { Name = "IsAssignableFrom", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_IsAssignableFrom
#endif
                    }},
                    {"GetType", new MemberRegisterInfo { Name = "GetType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetType
#endif
                    }},
                    {"GetElementType", new MemberRegisterInfo { Name = "GetElementType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetElementType
#endif
                    }},
                    {"GetArrayRank", new MemberRegisterInfo { Name = "GetArrayRank", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetArrayRank
#endif
                    }},
                    {"GetGenericTypeDefinition", new MemberRegisterInfo { Name = "GetGenericTypeDefinition", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetGenericTypeDefinition
#endif
                    }},
                    {"GetGenericArguments", new MemberRegisterInfo { Name = "GetGenericArguments", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetGenericArguments
#endif
                    }},
                    {"GetGenericParameterConstraints", new MemberRegisterInfo { Name = "GetGenericParameterConstraints", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetGenericParameterConstraints
#endif
                    }},
                    {"GetConstructor", new MemberRegisterInfo { Name = "GetConstructor", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetConstructor
#endif
                    }},
                    {"GetConstructors", new MemberRegisterInfo { Name = "GetConstructors", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetConstructors
#endif
                    }},
                    {"GetEvent", new MemberRegisterInfo { Name = "GetEvent", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEvent
#endif
                    }},
                    {"GetEvents", new MemberRegisterInfo { Name = "GetEvents", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEvents
#endif
                    }},
                    {"GetField", new MemberRegisterInfo { Name = "GetField", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetField
#endif
                    }},
                    {"GetFields", new MemberRegisterInfo { Name = "GetFields", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetFields
#endif
                    }},
                    {"GetMember", new MemberRegisterInfo { Name = "GetMember", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetMember
#endif
                    }},
                    {"GetMembers", new MemberRegisterInfo { Name = "GetMembers", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetMembers
#endif
                    }},
                    {"GetMethod", new MemberRegisterInfo { Name = "GetMethod", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetMethod
#endif
                    }},
                    {"GetMethods", new MemberRegisterInfo { Name = "GetMethods", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetMethods
#endif
                    }},
                    {"GetNestedType", new MemberRegisterInfo { Name = "GetNestedType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetNestedType
#endif
                    }},
                    {"GetNestedTypes", new MemberRegisterInfo { Name = "GetNestedTypes", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetNestedTypes
#endif
                    }},
                    {"GetProperty", new MemberRegisterInfo { Name = "GetProperty", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetProperty
#endif
                    }},
                    {"GetProperties", new MemberRegisterInfo { Name = "GetProperties", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetProperties
#endif
                    }},
                    {"GetDefaultMembers", new MemberRegisterInfo { Name = "GetDefaultMembers", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetDefaultMembers
#endif
                    }},
                    {"InvokeMember", new MemberRegisterInfo { Name = "InvokeMember", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_InvokeMember
#endif
                    }},
                    {"GetInterface", new MemberRegisterInfo { Name = "GetInterface", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetInterface
#endif
                    }},
                    {"GetInterfaces", new MemberRegisterInfo { Name = "GetInterfaces", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetInterfaces
#endif
                    }},
                    {"GetInterfaceMap", new MemberRegisterInfo { Name = "GetInterfaceMap", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetInterfaceMap
#endif
                    }},
                    {"IsInstanceOfType", new MemberRegisterInfo { Name = "IsInstanceOfType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_IsInstanceOfType
#endif
                    }},
                    {"IsEquivalentTo", new MemberRegisterInfo { Name = "IsEquivalentTo", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_IsEquivalentTo
#endif
                    }},
                    {"GetEnumUnderlyingType", new MemberRegisterInfo { Name = "GetEnumUnderlyingType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEnumUnderlyingType
#endif
                    }},
                    {"GetEnumValues", new MemberRegisterInfo { Name = "GetEnumValues", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetEnumValues
#endif
                    }},
                    {"MakeArrayType", new MemberRegisterInfo { Name = "MakeArrayType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_MakeArrayType
#endif
                    }},
                    {"MakeByRefType", new MemberRegisterInfo { Name = "MakeByRefType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_MakeByRefType
#endif
                    }},
                    {"MakeGenericType", new MemberRegisterInfo { Name = "MakeGenericType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_MakeGenericType
#endif
                    }},
                    {"MakePointerType", new MemberRegisterInfo { Name = "MakePointerType", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_MakePointerType
#endif
                    }},
                    {"ToString", new MemberRegisterInfo { Name = "ToString", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_ToString
#endif
                    }},
                    {"Equals", new MemberRegisterInfo { Name = "Equals", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_Equals
#endif
                    }},
                    {"GetHashCode", new MemberRegisterInfo { Name = "GetHashCode", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.M_GetHashCode
#endif
                    }},
                    {"op_Equality", new MemberRegisterInfo { Name = "op_Equality", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.O_op_Equality
#endif
                    }},
                    {"op_Inequality", new MemberRegisterInfo { Name = "op_Inequality", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.O_op_Inequality
#endif
                    }},
                    {"IsSerializable", new MemberRegisterInfo { Name = "IsSerializable", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSerializable
#endif
                    }},
                    {"ContainsGenericParameters", new MemberRegisterInfo { Name = "ContainsGenericParameters", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_ContainsGenericParameters
#endif
                    }},
                    {"IsVisible", new MemberRegisterInfo { Name = "IsVisible", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsVisible
#endif
                    }},
                    {"MemberType", new MemberRegisterInfo { Name = "MemberType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_MemberType
#endif
                    }},
                    {"Namespace", new MemberRegisterInfo { Name = "Namespace", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Namespace
#endif
                    }},
                    {"AssemblyQualifiedName", new MemberRegisterInfo { Name = "AssemblyQualifiedName", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_AssemblyQualifiedName
#endif
                    }},
                    {"FullName", new MemberRegisterInfo { Name = "FullName", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_FullName
#endif
                    }},
                    {"Assembly", new MemberRegisterInfo { Name = "Assembly", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Assembly
#endif
                    }},
                    {"Module", new MemberRegisterInfo { Name = "Module", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Module
#endif
                    }},
                    {"IsNested", new MemberRegisterInfo { Name = "IsNested", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNested
#endif
                    }},
                    {"DeclaringType", new MemberRegisterInfo { Name = "DeclaringType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_DeclaringType
#endif
                    }},
                    {"DeclaringMethod", new MemberRegisterInfo { Name = "DeclaringMethod", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_DeclaringMethod
#endif
                    }},
                    {"ReflectedType", new MemberRegisterInfo { Name = "ReflectedType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_ReflectedType
#endif
                    }},
                    {"UnderlyingSystemType", new MemberRegisterInfo { Name = "UnderlyingSystemType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_UnderlyingSystemType
#endif
                    }},
                    {"IsTypeDefinition", new MemberRegisterInfo { Name = "IsTypeDefinition", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsTypeDefinition
#endif
                    }},
                    {"IsArray", new MemberRegisterInfo { Name = "IsArray", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsArray
#endif
                    }},
                    {"IsByRef", new MemberRegisterInfo { Name = "IsByRef", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsByRef
#endif
                    }},
                    {"IsPointer", new MemberRegisterInfo { Name = "IsPointer", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsPointer
#endif
                    }},
                    {"IsConstructedGenericType", new MemberRegisterInfo { Name = "IsConstructedGenericType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsConstructedGenericType
#endif
                    }},
                    {"IsGenericParameter", new MemberRegisterInfo { Name = "IsGenericParameter", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsGenericParameter
#endif
                    }},
                    {"IsGenericTypeParameter", new MemberRegisterInfo { Name = "IsGenericTypeParameter", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsGenericTypeParameter
#endif
                    }},
                    {"IsGenericMethodParameter", new MemberRegisterInfo { Name = "IsGenericMethodParameter", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsGenericMethodParameter
#endif
                    }},
                    {"IsGenericType", new MemberRegisterInfo { Name = "IsGenericType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsGenericType
#endif
                    }},
                    {"IsGenericTypeDefinition", new MemberRegisterInfo { Name = "IsGenericTypeDefinition", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsGenericTypeDefinition
#endif
                    }},
                    {"IsSZArray", new MemberRegisterInfo { Name = "IsSZArray", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.DontBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    
#endif
                    }},
                    {"IsVariableBoundArray", new MemberRegisterInfo { Name = "IsVariableBoundArray", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsVariableBoundArray
#endif
                    }},
                    {"IsByRefLike", new MemberRegisterInfo { Name = "IsByRefLike", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsByRefLike
#endif
                    }},
                    {"HasElementType", new MemberRegisterInfo { Name = "HasElementType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_HasElementType
#endif
                    }},
                    {"GenericTypeArguments", new MemberRegisterInfo { Name = "GenericTypeArguments", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_GenericTypeArguments
#endif
                    }},
                    {"GenericParameterPosition", new MemberRegisterInfo { Name = "GenericParameterPosition", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_GenericParameterPosition
#endif
                    }},
                    {"GenericParameterAttributes", new MemberRegisterInfo { Name = "GenericParameterAttributes", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_GenericParameterAttributes
#endif
                    }},
                    {"Attributes", new MemberRegisterInfo { Name = "Attributes", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Attributes
#endif
                    }},
                    {"IsAbstract", new MemberRegisterInfo { Name = "IsAbstract", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsAbstract
#endif
                    }},
                    {"IsImport", new MemberRegisterInfo { Name = "IsImport", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsImport
#endif
                    }},
                    {"IsSealed", new MemberRegisterInfo { Name = "IsSealed", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSealed
#endif
                    }},
                    {"IsSpecialName", new MemberRegisterInfo { Name = "IsSpecialName", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSpecialName
#endif
                    }},
                    {"IsClass", new MemberRegisterInfo { Name = "IsClass", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsClass
#endif
                    }},
                    {"IsNestedAssembly", new MemberRegisterInfo { Name = "IsNestedAssembly", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedAssembly
#endif
                    }},
                    {"IsNestedFamANDAssem", new MemberRegisterInfo { Name = "IsNestedFamANDAssem", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedFamANDAssem
#endif
                    }},
                    {"IsNestedFamily", new MemberRegisterInfo { Name = "IsNestedFamily", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedFamily
#endif
                    }},
                    {"IsNestedFamORAssem", new MemberRegisterInfo { Name = "IsNestedFamORAssem", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedFamORAssem
#endif
                    }},
                    {"IsNestedPrivate", new MemberRegisterInfo { Name = "IsNestedPrivate", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedPrivate
#endif
                    }},
                    {"IsNestedPublic", new MemberRegisterInfo { Name = "IsNestedPublic", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNestedPublic
#endif
                    }},
                    {"IsNotPublic", new MemberRegisterInfo { Name = "IsNotPublic", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsNotPublic
#endif
                    }},
                    {"IsPublic", new MemberRegisterInfo { Name = "IsPublic", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsPublic
#endif
                    }},
                    {"IsAutoLayout", new MemberRegisterInfo { Name = "IsAutoLayout", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsAutoLayout
#endif
                    }},
                    {"IsExplicitLayout", new MemberRegisterInfo { Name = "IsExplicitLayout", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsExplicitLayout
#endif
                    }},
                    {"IsLayoutSequential", new MemberRegisterInfo { Name = "IsLayoutSequential", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsLayoutSequential
#endif
                    }},
                    {"IsAnsiClass", new MemberRegisterInfo { Name = "IsAnsiClass", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsAnsiClass
#endif
                    }},
                    {"IsAutoClass", new MemberRegisterInfo { Name = "IsAutoClass", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsAutoClass
#endif
                    }},
                    {"IsUnicodeClass", new MemberRegisterInfo { Name = "IsUnicodeClass", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsUnicodeClass
#endif
                    }},
                    {"IsCOMObject", new MemberRegisterInfo { Name = "IsCOMObject", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsCOMObject
#endif
                    }},
                    {"IsContextful", new MemberRegisterInfo { Name = "IsContextful", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsContextful
#endif
                    }},
                    {"IsCollectible", new MemberRegisterInfo { Name = "IsCollectible", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.SlowBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    
#endif
                    }},
                    {"IsEnum", new MemberRegisterInfo { Name = "IsEnum", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsEnum
#endif
                    }},
                    {"IsMarshalByRef", new MemberRegisterInfo { Name = "IsMarshalByRef", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsMarshalByRef
#endif
                    }},
                    {"IsPrimitive", new MemberRegisterInfo { Name = "IsPrimitive", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsPrimitive
#endif
                    }},
                    {"IsValueType", new MemberRegisterInfo { Name = "IsValueType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsValueType
#endif
                    }},
                    {"IsSignatureType", new MemberRegisterInfo { Name = "IsSignatureType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSignatureType
#endif
                    }},
                    {"IsSecurityCritical", new MemberRegisterInfo { Name = "IsSecurityCritical", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSecurityCritical
#endif
                    }},
                    {"IsSecuritySafeCritical", new MemberRegisterInfo { Name = "IsSecuritySafeCritical", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSecuritySafeCritical
#endif
                    }},
                    {"IsSecurityTransparent", new MemberRegisterInfo { Name = "IsSecurityTransparent", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsSecurityTransparent
#endif
                    }},
                    {"StructLayoutAttribute", new MemberRegisterInfo { Name = "StructLayoutAttribute", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_StructLayoutAttribute
#endif
                    }},
                    {"TypeInitializer", new MemberRegisterInfo { Name = "TypeInitializer", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_TypeInitializer
#endif
                    }},
                    {"TypeHandle", new MemberRegisterInfo { Name = "TypeHandle", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_TypeHandle
#endif
                    }},
                    {"GUID", new MemberRegisterInfo { Name = "GUID", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_GUID
#endif
                    }},
                    {"BaseType", new MemberRegisterInfo { Name = "BaseType", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_BaseType
#endif
                    }},
                    {"IsInterface", new MemberRegisterInfo { Name = "IsInterface", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_IsInterface
#endif
                    }},
                    {"GetTypeHandle_static", new MemberRegisterInfo { Name = "GetTypeHandle", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeHandle
#endif
                    }},
                    {"GetTypeArray_static", new MemberRegisterInfo { Name = "GetTypeArray", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeArray
#endif
                    }},
                    {"GetTypeCode_static", new MemberRegisterInfo { Name = "GetTypeCode", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeCode
#endif
                    }},
                    {"GetTypeFromCLSID_static", new MemberRegisterInfo { Name = "GetTypeFromCLSID", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeFromCLSID
#endif
                    }},
                    {"GetTypeFromProgID_static", new MemberRegisterInfo { Name = "GetTypeFromProgID", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeFromProgID
#endif
                    }},
                    {"MakeGenericSignatureType_static", new MemberRegisterInfo { Name = "MakeGenericSignatureType", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.SlowBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    
#endif
                    }},
                    {"MakeGenericMethodParameter_static", new MemberRegisterInfo { Name = "MakeGenericMethodParameter", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_MakeGenericMethodParameter
#endif
                    }},
                    {"GetTypeFromHandle_static", new MemberRegisterInfo { Name = "GetTypeFromHandle", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetTypeFromHandle
#endif
                    }},
                    {"GetType_static", new MemberRegisterInfo { Name = "GetType", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_GetType
#endif
                    }},
                    {"ReflectionOnlyGetType_static", new MemberRegisterInfo { Name = "ReflectionOnlyGetType", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = System_Type_Wrap.F_ReflectionOnlyGetType
#endif
                    }},
                    {"DefaultBinder_static", new MemberRegisterInfo { Name = "DefaultBinder", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_DefaultBinder
#endif
                    }},
                    {"Delimiter_static", new MemberRegisterInfo { Name = "Delimiter", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Delimiter
#endif
                    }},
                    {"EmptyTypes_static", new MemberRegisterInfo { Name = "EmptyTypes", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_EmptyTypes
#endif
                    }},
                    {"Missing_static", new MemberRegisterInfo { Name = "Missing", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_Missing
#endif
                    }},
                    {"FilterAttribute_static", new MemberRegisterInfo { Name = "FilterAttribute", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_FilterAttribute
#endif
                    }},
                    {"FilterName_static", new MemberRegisterInfo { Name = "FilterName", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_FilterName
#endif
                    }},
                    {"FilterNameIgnoreCase_static", new MemberRegisterInfo { Name = "FilterNameIgnoreCase", IsStatic = true, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = System_Type_Wrap.G_FilterNameIgnoreCase
#endif
                    }},
                }
            };
        }
        public static RegisterInfo GetRegisterInfo_UnityEngine_UI_Text_Wrap() 
        {
            return new RegisterInfo 
            {
#if !EXPERIMENTAL_IL2CPP_PUERTS || !ENABLE_IL2CPP
                BlittableCopy = false,
#endif
                Members = new System.Collections.Generic.Dictionary<string, MemberRegisterInfo>
                {
                    
                    {"FontTextureChanged", new MemberRegisterInfo { Name = "FontTextureChanged", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = UnityEngine_UI_Text_Wrap.M_FontTextureChanged
#endif
                    }},
                    {"GetGenerationSettings", new MemberRegisterInfo { Name = "GetGenerationSettings", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = UnityEngine_UI_Text_Wrap.M_GetGenerationSettings
#endif
                    }},
                    {"CalculateLayoutInputHorizontal", new MemberRegisterInfo { Name = "CalculateLayoutInputHorizontal", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = UnityEngine_UI_Text_Wrap.M_CalculateLayoutInputHorizontal
#endif
                    }},
                    {"CalculateLayoutInputVertical", new MemberRegisterInfo { Name = "CalculateLayoutInputVertical", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = UnityEngine_UI_Text_Wrap.M_CalculateLayoutInputVertical
#endif
                    }},
                    {"OnRebuildRequested", new MemberRegisterInfo { Name = "OnRebuildRequested", IsStatic = false, MemberType = MemberType.Method, UseBindingMode = BindingMode.SlowBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    
#endif
                    }},
                    {"cachedTextGenerator", new MemberRegisterInfo { Name = "cachedTextGenerator", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_cachedTextGenerator
#endif
                    }},
                    {"cachedTextGeneratorForLayout", new MemberRegisterInfo { Name = "cachedTextGeneratorForLayout", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_cachedTextGeneratorForLayout
#endif
                    }},
                    {"mainTexture", new MemberRegisterInfo { Name = "mainTexture", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_mainTexture
#endif
                    }},
                    {"font", new MemberRegisterInfo { Name = "font", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_font, PropertySetter = UnityEngine_UI_Text_Wrap.S_font
#endif
                    }},
                    {"text", new MemberRegisterInfo { Name = "text", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_text, PropertySetter = UnityEngine_UI_Text_Wrap.S_text
#endif
                    }},
                    {"supportRichText", new MemberRegisterInfo { Name = "supportRichText", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_supportRichText, PropertySetter = UnityEngine_UI_Text_Wrap.S_supportRichText
#endif
                    }},
                    {"resizeTextForBestFit", new MemberRegisterInfo { Name = "resizeTextForBestFit", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_resizeTextForBestFit, PropertySetter = UnityEngine_UI_Text_Wrap.S_resizeTextForBestFit
#endif
                    }},
                    {"resizeTextMinSize", new MemberRegisterInfo { Name = "resizeTextMinSize", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_resizeTextMinSize, PropertySetter = UnityEngine_UI_Text_Wrap.S_resizeTextMinSize
#endif
                    }},
                    {"resizeTextMaxSize", new MemberRegisterInfo { Name = "resizeTextMaxSize", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_resizeTextMaxSize, PropertySetter = UnityEngine_UI_Text_Wrap.S_resizeTextMaxSize
#endif
                    }},
                    {"alignment", new MemberRegisterInfo { Name = "alignment", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_alignment, PropertySetter = UnityEngine_UI_Text_Wrap.S_alignment
#endif
                    }},
                    {"alignByGeometry", new MemberRegisterInfo { Name = "alignByGeometry", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_alignByGeometry, PropertySetter = UnityEngine_UI_Text_Wrap.S_alignByGeometry
#endif
                    }},
                    {"fontSize", new MemberRegisterInfo { Name = "fontSize", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_fontSize, PropertySetter = UnityEngine_UI_Text_Wrap.S_fontSize
#endif
                    }},
                    {"horizontalOverflow", new MemberRegisterInfo { Name = "horizontalOverflow", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_horizontalOverflow, PropertySetter = UnityEngine_UI_Text_Wrap.S_horizontalOverflow
#endif
                    }},
                    {"verticalOverflow", new MemberRegisterInfo { Name = "verticalOverflow", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_verticalOverflow, PropertySetter = UnityEngine_UI_Text_Wrap.S_verticalOverflow
#endif
                    }},
                    {"lineSpacing", new MemberRegisterInfo { Name = "lineSpacing", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_lineSpacing, PropertySetter = UnityEngine_UI_Text_Wrap.S_lineSpacing
#endif
                    }},
                    {"fontStyle", new MemberRegisterInfo { Name = "fontStyle", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_fontStyle, PropertySetter = UnityEngine_UI_Text_Wrap.S_fontStyle
#endif
                    }},
                    {"pixelsPerUnit", new MemberRegisterInfo { Name = "pixelsPerUnit", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_pixelsPerUnit
#endif
                    }},
                    {"minWidth", new MemberRegisterInfo { Name = "minWidth", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_minWidth
#endif
                    }},
                    {"preferredWidth", new MemberRegisterInfo { Name = "preferredWidth", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_preferredWidth
#endif
                    }},
                    {"flexibleWidth", new MemberRegisterInfo { Name = "flexibleWidth", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_flexibleWidth
#endif
                    }},
                    {"minHeight", new MemberRegisterInfo { Name = "minHeight", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_minHeight
#endif
                    }},
                    {"preferredHeight", new MemberRegisterInfo { Name = "preferredHeight", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_preferredHeight
#endif
                    }},
                    {"flexibleHeight", new MemberRegisterInfo { Name = "flexibleHeight", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_flexibleHeight
#endif
                    }},
                    {"layoutPriority", new MemberRegisterInfo { Name = "layoutPriority", IsStatic = false, MemberType = MemberType.Property, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , PropertyGetter = UnityEngine_UI_Text_Wrap.G_layoutPriority
#endif
                    }},
                    {"GetTextAnchorPivot_static", new MemberRegisterInfo { Name = "GetTextAnchorPivot", IsStatic = true, MemberType = MemberType.Method, UseBindingMode = BindingMode.FastBinding
#if !EXPERIMENTAL_IL2CPP_PUERTS
                    , Method = UnityEngine_UI_Text_Wrap.F_GetTextAnchorPivot
#endif
                    }},
                }
            };
        }

        public static void AddRegisterInfoGetterIntoJsEnv(JsEnv jsEnv)
        {
            
            jsEnv.AddRegisterInfoGetter(typeof(PerformanceHelper), GetRegisterInfo_PerformanceHelper_Wrap);
            jsEnv.AddRegisterInfoGetter(typeof(System.Type), GetRegisterInfo_System_Type_Wrap);
            jsEnv.AddRegisterInfoGetter(typeof(UnityEngine.UI.Text), GetRegisterInfo_UnityEngine_UI_Text_Wrap);
        }
    }
}