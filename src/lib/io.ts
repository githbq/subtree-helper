import * as pathTool from 'path'
import * as fs from 'fs-extra'
import * as _ from 'lodash'

import { rootPath, cwd } from './consts'
import { stringify } from './other'
import * as rimraf from 'rimraf'
/**
 * 文件操作　全部是异步的
 */
export const io = {
    fs,
    rimraf,
    pathTool,
    /**
     * 路径预处理
     * @param path 路径　
     * @param options 参数
     */
    resolveOptions(path: string | Array<string>, options: any = { fromRoot: false, fromCwd: false }) {
        path = pathTool.join.apply(null, [].concat(path))
        // 考虑多路径处理
        path = pathTool.join.apply(null, (options.fromRoot ? [rootPath] : options.fromCwd ? [cwd] : []).concat(path))
        return path
    },
    read(path: string | Array<string>, options: any = { fromRoot: false, fromCwd: false }) {
        const newPath = this.resolveOptions(path, options)
        return fs.readFile(newPath, 'utf8')
    },
    readJson(path: string | Array<string>, options: any = { fromRoot: false, fromCwd: false }) {
        const newPath = this.resolveOptions(path, options)
        return fs.readJson(newPath)
    },
    write(path: string | Array<string>, content, options: any = { fromRoot: false, fromCwd: false }) {
        const newPath = this.resolveOptions(path, options)
        // 对对象进行 美化格式处理
        content = _.isObject(content) ? stringify(content) : content
        return fs.outputFile(newPath, content)
    },
    delete(path: string | Array<string>, options: any = { fromRoot: false, fromCwd: false }) {
        const newPath = this.resolveOptions(path, options)
        return fs.remove(newPath)
    },
    exists(path: string | Array<string>, options: any = { fromRoot: false, fromCwd: false }) {
        const newPath = this.resolveOptions(path, options)
        return fs.exists(newPath)
    },
}