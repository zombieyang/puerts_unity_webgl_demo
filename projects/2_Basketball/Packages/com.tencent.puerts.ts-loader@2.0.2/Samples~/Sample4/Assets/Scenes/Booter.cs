using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;
using Puerts.TSLoader;
using System.IO;
using System;

public class Booter : MonoBehaviour
{
    JsEnv env;
    // Start is called before the first frame update
    void Start()
    {
        var loader = new TSLoader(System.IO.Path.Combine(Application.dataPath, "../Puer-Project"));
        loader.UseRuntimeLoader(new NodeModuleLoader(Application.dataPath + "/../Puer-Project"));
        loader.UseRuntimeLoader(new DefaultLoader());
        env = new JsEnv(loader);
        env.ExecuteModule("main.mts");
    }

    // Update is called once per frame
    void Update()
    {
    }
}
