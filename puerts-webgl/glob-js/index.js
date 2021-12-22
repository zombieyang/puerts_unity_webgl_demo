
const fs = require("fs");
const glob = require("glob");
const path = require("path");
const mkdirp = require("mkdirp");

const allJSFile = glob.sync(csharp.UnityEngine.Application.dataPath + '/**/Resources/**/*.js.txt')
    .filter(jsfile => {
        return jsfile.indexOf('Editor') == -1
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

function buildForBrowser(outputpath) {
    const puerts_js_file = {};
    allJSFile.forEach(({ resourceName, jsfile }) => {
        puerts_js_file[resourceName] = `(function(exports, require, module, __filename, __dirname) {
            ${fs.readFileSync(jsfile, 'utf-8')}
        })`;
    })
    fs.writeFileSync(path.join(outputpath, 'puerts_browser_js_resources.js'), `
        window.PUERTS_JS_RESOURCES = {${
            Object.keys(puerts_js_file).map(resourceName=> {
                return `"${resourceName}": ${puerts_js_file[resourceName]}`
            }).join(',')
        }};
    `);
}
function buildForMinigame(outputpath) {
    const outputdir = path.join(outputpath, 'puerts_minigame_js_resources');
    mkdirp.sync(outputdir);

    allJSFile.forEach(({ resourceName, jsfile }) => {     
        const resourceFile = path.join(outputdir, resourceName);
        mkdirp.sync(path.dirname(resourceFile));
        fs.writeFileSync(
            resourceFile,
            fs.readFileSync(jsfile, 'utf-8')
        );
    })
}

function buildHTML(outputpath) {
    fs.writeFileSync(path.join(outputpath, 'index.html'), `
    <!DOCTYPE html>
<html lang="en-us">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Unity WebGL Player | puerts_unity_webgl_demo</title>
    <link rel="shortcut icon" href="TemplateData/favicon.ico">
    <link rel="stylesheet" href="TemplateData/style.css">
    <script src="TemplateData/UnityProgress.js"></script>
    <script src="Build/UnityLoader.js"></script>
  </head>
  <body>
    <div class="webgl-content">
      <div id="unityContainer" style="width: 960px; height: 600px"></div>
      <div class="footer">
        <div class="webgl-logo"></div>
        <div class="fullscreen" onclick="unityInstance.SetFullscreen(1)"></div>
        <div class="title">puerts_unity_webgl_demo</div>
      </div>
    </div>
    <script>
      function getScript(url, callback) {
        var script = document.createElement("script");
        script.src = url;
        script.onload = callback;
        document.body.appendChild(script);
      }
      getScript('puerts_browser_js_resources.js', function() {
        var unityInstance = UnityLoader.instantiate("unityContainer", "Build/${path.basename(outputpath)}.json", {onProgress: UnityProgress});
      })

    </script>
  </body>
</html>
    `)
}

exports.buildForMinigame = function(outputpath) {
    buildForMinigame(outputpath);
}
exports.buildForBrowser = function(outputpath) {
    buildForBrowser(outputpath);
    // buildHTML(outputpath);
}