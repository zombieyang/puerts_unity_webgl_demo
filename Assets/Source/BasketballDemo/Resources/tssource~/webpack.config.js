module.exports = {
    mode: 'development',
    entry: __dirname + "/output/entry.js",
    devtool: 'inline-source-map',
    output: {
        filename: 'behaviours.mjs',
        path: __dirname + '/../',
        environment: { module: true },
        libraryTarget: 'module'
    },
    externalsType: "module",
    externals: {
        csharp: 'csharp',
        puerts: 'puerts',
    },
    experiments: {
        outputModule: true
    }
}