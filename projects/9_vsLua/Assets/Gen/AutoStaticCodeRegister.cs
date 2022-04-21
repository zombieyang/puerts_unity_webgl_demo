namespace PuertsStaticWrap
{
    public static class AutoStaticCodeRegister
    {
        public static void Register(Puerts.JsEnv jsEnv)
        {
            jsEnv.AddLazyStaticWrapLoader(typeof(PerformanceHelper), PerformanceHelper_Wrap.GetRegisterInfo);
                
        }
    }
}