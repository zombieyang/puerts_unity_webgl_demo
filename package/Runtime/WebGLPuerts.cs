#if UNITY_WEBGL
using System;
using System.Runtime.InteropServices;

namespace Puerts
{
    public static class WebGL
    {
        protected static bool jsEngineCreated = false;
        public static JsEnv CreateWebGLJsEnv(ILoader loader = new DefaultLoader(), int debugPort = -1)
        {
            if (jsEngineCreated) 
            {
                throw new Exception("only one jsEngine is allowed in webgl mode");
            }

        #if !UNITY_EDITOR
            InitPuertsWebGL();
        #endif

            try 
            {
            #if !UNITY_EDITOR
                SetCallV8(CallV8FunctionCallback, CallV8ConstructorCallback, CallV8DestructorCallback);    
            #endif
                JsEnv env = new JsEnv(loader, debugPort);
                jsEngineCreated = true;
                return env;
            }
            catch(Exception e)
            {
            #if !UNITY_EDITOR
                InitPuertsWebGLRollback();
            #endif
                throw e;
            }
        }


        [DllImport(DLLNAME, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr InitPuertsWebGL();

        [DllImport(DLLNAME, CallingConvention = CallingConvention.Cdecl)]
        private static extern IntPtr InitPuertsWebGLRollback();


        internal delegate void CallV8Function(int functionCallback, int info, int self, int paramLen, int data);
        internal delegate int CallV8Constructor(int constructorCallback, int info, int paramLen, int data);
        internal delegate void CallV8Destructor(int destructorCallback, int self, int data);
        
        [MonoPInvokeCallback(typeof(CallV8Function))]
        internal static void CallV8FunctionCallback(int functionCallback, int info, int self, int paramLen, int data)
        {
            V8FunctionCallback callback =
                Marshal.GetDelegateForFunctionPointer<V8FunctionCallback>(new IntPtr(functionCallback));
            callback.Invoke(IntPtr.Zero, new IntPtr(info), new IntPtr(self), paramLen, data);
        }

        [MonoPInvokeCallback(typeof(CallV8Constructor))]
        internal static int CallV8ConstructorCallback(int constructorCallback, int info, int paramLen, int data)
        {
            V8ConstructorCallback callback =
                Marshal.GetDelegateForFunctionPointer<V8ConstructorCallback>(new IntPtr(constructorCallback));
            return callback.Invoke(IntPtr.Zero, new IntPtr(info), paramLen, data).ToInt32();
        }

        [MonoPInvokeCallback(typeof(CallV8Destructor))]
        internal static void CallV8DestructorCallback(int destructorCallback, int self, int data)
        {
            V8DestructorCallback callback =
                Marshal.GetDelegateForFunctionPointer<V8DestructorCallback>(new IntPtr(destructorCallback));
            callback.Invoke(new IntPtr(self), data);
        }

        [DllImport("__Internal", CallingConvention = CallingConvention.Cdecl)]
        internal static extern void SetCallV8(CallV8Function callV8Function, CallV8Constructor callV8Constructor,
            CallV8Destructor callV8Destructor);
    }
}
#endif