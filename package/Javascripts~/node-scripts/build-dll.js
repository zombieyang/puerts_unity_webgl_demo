const { program, Option } = require('commander');
const { compileTypescriptProject, exec, rm, mv, mkdir } = require('@puerts/shell-util')
const { join } = require('path');

module.exports = async function buildDLL (projectPath) {

    // tsc 
    compileTypescriptProject(join(__dirname, '../PuertsDLLMock/tsconfig.json'));

    const wd = join(__dirname, '../PuertsDLLMock');
    // webpack
    await exec(`cd ${wd} && npx webpack -c webpack.config.js`)

    rm('-rf', join(wd, 'output'));

    mkdir('-p', projectPath);
    
    console.log(
        join(wd, 'dist/puerts-runtime.js'),
        join(projectPath, 'puerts-runtime.js')
    )

    mv(
        join(wd, 'dist/puerts-runtime.js'),
        join(projectPath, 'puerts-runtime.js')
    )
}

if (require.main == module) {
    program.addOption(
        new Option("-p --path <projectPath>", 'the webgl project path')
            .required()
    );
    program.parse(process.argv);
    const options = program.opts();
    const projectPath = options.projectPath;

    buildDLL(projectPath).catch(console.error)
}
