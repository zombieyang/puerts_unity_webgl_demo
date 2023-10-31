import { global } from "./library";

declare const CS: any;
declare const PUERTS_JS_RESOURCES: any;
declare const __tgjsGetLoader: any;
declare const wxRequire: any;

const executeModuleCache: { [filename: string]: any } = {};

export function addSyntheticModule(name: string, jso: any) {
    executeModuleCache[name] = jso
}

export default function initRequire() {
    const loader = typeof __tgjsGetLoader != 'undefined' ? __tgjsGetLoader() : null;

    const loaderResolve = loader.Resolve ? (function (fileName: string, to: string = "") {
        const resolvedName = loader.Resolve(fileName, to);
        if (!resolvedName) {
            throw new Error('module not found: ' + fileName);
        }
        return resolvedName;
    }) : null;

    function normalize(name: string, to: string) {
        if (typeof CS != void 0) {
            if (CS.Puerts.PathHelper.IsRelative(to)) {
                const ret = CS.Puerts.PathHelper.normalize(CS.Puerts.PathHelper.Dirname(name) + "/" + to);
                return ret;
            }
        }
        return to;
    }
    function puerRequire(specifier: string, from: string = "") {
        if (loaderResolve) {
            specifier = loaderResolve(specifier, from);

        } else if (from) {
            specifier = normalize(from, specifier);
        }
        if (!specifier) throw new Error("[Puer003] Module not found: " + specifier);

        const result: any = { exports: {} };
        const foundCacheSpecifier = tryFindAndGetFindedSpecifier(specifier, executeModuleCache);
        if (foundCacheSpecifier) {
            result.exports = executeModuleCache[foundCacheSpecifier];
            return result.exports;

        }

        if (typeof wx != 'undefined') {
            specifier = (specifier.endsWith('.js') ? specifier : specifier + ".js")
            const result = wxRequire('puerts_minigame_js_resources/' + specifier);
            return result
    
        } else {
            const foundSpecifier = tryFindAndGetFindedSpecifier(specifier, PUERTS_JS_RESOURCES);
            if (!foundSpecifier) {
                throw new Error('module not found: ' + specifier);
            }
            specifier = foundSpecifier;
    
            executeModuleCache[specifier] = -1;
            try {
                PUERTS_JS_RESOURCES[specifier](result.exports, function mRequire(specifierTo: string) {
                    return puerRequire(specifierTo, specifier);
                }, result);
            } catch (e) {
                delete executeModuleCache[specifier];
                throw e
            }
            executeModuleCache[specifier] = result.exports;
        }

        return result.exports;
        function tryFindAndGetFindedSpecifier(specifier: string, obj: any) {
            let tryFindName = [specifier];
            if (specifier.indexOf('.') == -1)
                tryFindName = tryFindName.concat([specifier + '.js', specifier + '.ts', specifier + '.mjs', specifier + '.mts']);

            let finded: number | false = tryFindName.reduce((ret, name, index) => {
                if (ret !== false) return ret;
                if (name in obj) {
                    if (obj[name] == -1) throw new Error(`circular dependency is detected when requiring "${name}"`);
                    return index;
                }
                return false;
            }, false)
            if (finded === false) {
                return null;
            }
            else {
                return tryFindName[finded];
            }
        }
    }

    const puer = global.puer || global.puerts || {};
    puer.require = puerRequire
    global.puer = puer;
    return puerRequire
}