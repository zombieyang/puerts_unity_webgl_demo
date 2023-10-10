# Changelog
All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

you can get the english version change log at [Github Release](https://github.com/Tencent/puerts/releases)

## [2.0.2] - 2023-09-07
1. compat with core@2.0.2
2. upgrade ConsoleRedirect to compat Unity2022

## [2.0.1] - 2023-08-14
1. compat with core@2.0.1
2. fix bug for loading `node:events`
3. fix bug for sourcemap loading

## [2.0.0] - 2023-07-31
1. compat with core@2.0.0

## [2.0.0-rc.1] - 2023-07-14
1. compat with core@2.0.0-rc.1
2. fix: release-to-resource时多个项目没有分文件摆放的问题
2. fix: `TSLoader.Resolve` did not combine the relative path in Runtime

## [2.0.0-pre.5] - 2023-06-16
1. compat with core@2.0.0-pre.5
2. support importing directory

## [1.1.0-rc.0] - 2023-04-20
1. Support NodeModuleLoader & add Sample4. It can help you to load node_modules in Editor faster.
2. now ts-loader need puerts.core@2.0.0-pre.3 and above.