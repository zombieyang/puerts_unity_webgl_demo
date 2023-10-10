declare namespace puer {
    function on(eventType: string, listener: Function, prepend?: boolean): void;
}
declare namespace CS {
    namespace UnityEngine {
        /** Option flags for specifying special treatment of a log message.
        */
        enum LogOption
        { None = 0, NoStacktrace = 1 }
        /** The type of the log message in Debug.unityLogger.Log or delegate registered with Application.RegisterLogCallback.
        */
        enum LogType
        { Error = 0, Assert = 1, Warning = 2, Log = 3, Exception = 4 }
        class Object 
        {
            
        }
        class Debug
        {
            /** Logs a message to the Unity Console.
            * @param message String or object to be converted to string representation for display.
            * @param context Object to which the message applies.
            */
            public static Log ($message: any) : void
            /** Logs a message to the Unity Console.
            * @param message String or object to be converted to string representation for display.
            * @param context Object to which the message applies.
            */
            public static Log ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted message to the Unity Console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            * @param logType Type of message e.g. warn or error etc.
            * @param logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted message to the Unity Console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            * @param logType Type of message e.g. warn or error etc.
            * @param logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** Logs a formatted message to the Unity Console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            * @param logType Type of message e.g. warn or error etc.
            * @param logOptions Option flags to treat the log message special.
            */
            public static LogFormat ($logType: UnityEngine.LogType, $logOptions: UnityEngine.LogOption, $context: UnityEngine.Object, $format: string, ...args: any[]) : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param message String or object to be converted to string representation for display.
            * @param context Object to which the message applies.
            */
            public static LogError ($message: any) : void
            /** A variant of Debug.Log that logs an error message to the console.
            * @param message String or object to be converted to string representation for display.
            * @param context Object to which the message applies.
            */
            public static LogError ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted error message to the Unity console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            */
            public static LogErrorFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted error message to the Unity console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            */
            public static LogErrorFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            public static ClearDeveloperConsole () : void
            public static LogWarning ($message: any) : void
            /** A variant of Debug.Log that logs a warning message to the console.
            * @param message String or object to be converted to string representation for display.
            * @param context Object to which the message applies.
            */
            public static LogWarning ($message: any, $context: UnityEngine.Object) : void
            /** Logs a formatted warning message to the Unity Console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            */
            public static LogWarningFormat ($format: string, ...args: any[]) : void
            /** Logs a formatted warning message to the Unity Console.
            * @param format A composite format string.
            * @param args Format arguments.
            * @param context Object to which the message applies.
            */
            public static LogWarningFormat ($context: UnityEngine.Object, $format: string, ...args: any[]) : void
            
            public constructor ()
        }
    }
}
