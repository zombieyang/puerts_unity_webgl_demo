import sms from './source-map-support.gen.mjs'
try {
    sms.install({
        retrieveFile: (path: string) => {
            //@ts-ignore
            try {
                return CS.Puerts.TSLoader.TSDirectoryCollector.EmitTSFile(path);
            } catch (e) { return ''; }
        }
    });

    CS.UnityEngine.Debug.Log("source-map-support: <color=green>enable</color>");
} catch (e) {
    CS.UnityEngine.Debug.LogError("source-map-support module exception:" + e.message + "\n" + e.stack);
}