/**
 * 收集resources目录所有的JS
 * 为minigame构建时，全数拷贝至微信插件导出的项目目录
 * 为browser构建时，将它们全数合并到一个js文件里，由HTML加载。
 */
const fs = require("fs");
const path = require("path");
const glob = require('glob');
const babel = require('@babel/core');
const { mkdir } = require("@puerts/shell-util");

function buildForBrowser(allJSFile, outputpath) {
    const puerts_js_file = {};
    allJSFile.forEach(({ resourceName, jsfile }) => {
        const code = fs.readFileSync(jsfile, 'utf-8');
        puerts_js_file[resourceName] = `(function(exports, require, module, __filename, __dirname) {
            ${babel.transformSync(code, {
            cwd: __dirname,
            "presets": [
                ["@babel/preset-env", { targets: { chrome: "84", esmodules: false } }]
            ]
        }).code}
        })`;
    })
    const targetPath = path.join(outputpath, 'puerts_browser_js_resources.js');
    mkdir('-p', path.dirname(targetPath));
    fs.writeFileSync(targetPath, `
        window.PUERTS_JS_RESOURCES = {${Object.keys(puerts_js_file).map(resourceName => {
            return `"${resourceName}": ${puerts_js_file[resourceName]}`
        }).join(',')
        }};
    `);
}
function buildForMinigame(allJSFile, outputpath) {
    const outputdir = path.join(outputpath, 'puerts_minigame_js_resources');
    mkdir('-p', outputdir);

    allJSFile.forEach(({ resourceName, jsfile }) => {
        const resourceFilePath = path.join(outputdir, resourceName);
        mkdir('-p', path.dirname(resourceFilePath));
        fs.writeFileSync(
            resourceFilePath.replace('.mjs', '.js').replace('.cjs', '.js'),
            fs.readFileSync(jsfile, 'utf-8')
        );
    })
}

function getAllJSFile (fileGlobbers) {
    const allJSFile = fileGlobbers
        .reduce((retArr, globber)=> {
            return retArr.concat(
                glob.sync(path.normalize(globber))
            )
        }, [])
        .filter(jsfile => {
            return jsfile.indexOf('Editor') == -1 && jsfile.indexOf('node_modules') == -1
        })
        .map(jsfile => {
            let resourceNameMatcher = jsfile.split('Resources/');
            let resourceName = resourceNameMatcher[resourceNameMatcher.length - 1];
            resourceName = resourceName.replace(/\.txt$/, '');

            return {
                resourceName,
                jsfile
            }
        })

    return allJSFile;
}

const fileGlobbers = [
    CS.UnityEngine.Application.dataPath + "/**/Resources/**/*.mjs",
    CS.UnityEngine.Application.dataPath + "/**/Resources/**/*.cjs",
    CS.System.IO.Path.GetFullPath("Packages/com.tencent.puerts.core/") + "/**/Resources/**/*.mjs",
    CS.System.IO.Path.GetFullPath("Packages/com.tencent.puerts.webgl/") + "/**/Resources/**/*.mjs",
];

module.exports = function (mode, outputpath) {
    if (mode == 'browser') {
        buildForBrowser(getAllJSFile(fileGlobbers), outputpath);

    } else if (mode == 'minigame') {
        buildForMinigame(getAllJSFile(fileGlobbers), outputpath);

    } else {
        throw Error('invalid mode: ' + mode);
    }
}