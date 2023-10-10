using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
using Puerts;
using Puerts.TSLoader;
using Unity.CodeEditor;

public class Main : MonoBehaviour
{
    JsEnv env;
    // Start is called before the first frame update
    void Start()
    {
        env = new JsEnv(new TSLoader(), 9222);
        Application.runInBackground = true;
        UnityEngine.Debug.Log("please connect inspector");
        env.WaitDebugger();

        env.ExecuteModule(@"main.mjs");

    }

    // Update is called once per frame
    void Update()
    {
        env.Tick();
    }
}
