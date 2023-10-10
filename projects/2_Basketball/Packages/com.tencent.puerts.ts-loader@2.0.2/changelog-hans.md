# Changelog
All notable changes to this package will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

you can get the english version change log at [Github Release](https://github.com/Tencent/puerts/releases)

## [2.0.2] - 2023-09-07
1. 兼容 core@2.0.2
2. 升级ConsoleRedirect以兼容Unity2022

## [2.0.1] - 2023-08-14
1. 兼容 core@2.0.1
2. 修复加载 `node:events` 的问题
3. 修复加载 sourcemap 的问题

## [2.0.0] - 2023-07-31
1. 兼容 core@2.0.0

## [2.0.0-rc.1] - 2023-07-14
1. 兼容 core@2.0.0-rc.1
2. 修复: release-to-resource时多个项目没有分文件摆放的问题
2. 修复: runtime时Resolve函数没有实现相对路径解析的问题

## [2.0.0-pre.5] - 2023-06-16
1. 兼容 core@2.0.0-pre.5
2. 支持import目录

## [1.1.0-rc.0] - 2023-04-20
1. 支持了 NodeModuleLoader, 添加Sample4。可以让你在Editor下直接import node_modules
2. ts-loader现在需求puerts.core@2.0.0-pre.3及更高版本.