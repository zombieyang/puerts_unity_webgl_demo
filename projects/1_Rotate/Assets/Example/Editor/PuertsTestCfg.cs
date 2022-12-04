using System.Collections.Generic;
using Puerts;
using System;
using UnityEngine;

[Configure]
public class PuertsTestCfg
{
    [Typing]
    static IEnumerable<Type> Typing
    {
        get
        {
            return new List<Type>()
            {
                typeof(PuertsTest.JsBehaviour),
                typeof(UnityEngine.Component),
                typeof(UnityEngine.Behaviour),
                typeof(UnityEngine.MonoBehaviour),
                typeof(UnityEngine.Transform),
                typeof(UnityEngine.Vector3),
            };
        }
    }

    [BlittableCopy]
    static IEnumerable<Type> Blittables
    {
        get
        {
            return new List<Type>()
            {
                //打开这个可以优化Vector3的GC，但需要开启unsafe编译
                typeof(UnityEngine.Vector3),
            };
        }
    }
}