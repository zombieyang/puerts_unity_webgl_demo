using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Puerts;
using Puerts.TSLoader;

public class Booter : MonoBehaviour
{
    JsEnv env;
    // Start is called before the first frame update
    void Start()
    {
        env = new JsEnv(new TSLoader(System.IO.Path.Combine(Application.dataPath, "../Puer-Project/out")));
        env.ExecuteModule("main.mts");
    }

    // Update is called once per frame
    void Update()
    {
        env.Tick();
    }
}
