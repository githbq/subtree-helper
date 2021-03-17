import { exec, consoleColor, io, stringify, cwd } from './utils'
import * as fs from 'fs-extra'

class SubtreeModel {
    public prefix: string
    public url: string
    public alias: string
    public branch: string
    constructor(options) {
        this.prefix = options.prefix
        this.url = options.url
        this.alias = options.alias
        this.branch = options.branch
    }
}

const subtreeFilePath = '.subtreerc.json'
/**
 * 安装node项目库
 */
export default class SubtreeHelper {
    constructor(subtrees) {
        this.subtrees = subtrees
    }
    subtrees: []
    /**
     * 启动
     */
    async tip(data) {
        consoleColor.green(
            `配置文件示例:
${stringify([new SubtreeModel({ prefix: 'common', url: 'http://xx.xx', alias: 'lib1', branch: 'master' })])}
配置文件示例结束          
`)
    }
    static async checkConfig() {
        const keys = ['alias', 'url', 'prefix', 'branch']
        let result = false
        const errors = []
        try {
            await fs.ensureFile(subtreeFilePath)
            const config = await fs.readJSON(subtreeFilePath)
            config.forEach(item => {
                const fullfilled = keys.every(key => Object.keys(item).includes(key))
                if (!fullfilled) {
                    errors.push(`${JSON.stringify(item)} 不符合要求,请确保每条配置包含: ${JSON.stringify(keys)} 字段`)
                }
            })
        } catch (e) {
            consoleColor.error(e)
        }
        result = errors.length > 0
        return result
    }
    async pull() {
        if (!await this.isGitStatusOK()) return

        //git subtree pull --prefix=<子目录名> <远程地址> <分支> --squash
        const subtrees = await this.getSubtrees()
        for (let subtree of subtrees) {
            const cmdStr = `git subtree pull --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch} --squash`
            consoleColor.start(cmdStr)
            await exec(cmdStr, { cwd })
        }
    }
    async push(subtree: SubtreeModel) {
        if (!await this.isGitStatusOK()) return
        //git subtree push --prefix=<子目录名> <远程地址> 分支
        await exec(`git subtree push --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch}`, { cwd, preventDefault: true })
    }
    async add() {
        if (!await this.isGitStatusOK()) return
        //git subtree add --prefix=<子目录名> <子仓库地址> <分支> --squash
        const subtrees = await this.getSubtrees()

        for (let subtree of subtrees) {
            try {
                const cmdStr = `git subtree add --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch} --squash`
                consoleColor.start(cmdStr)
                await exec(cmdStr, { cwd })
            } catch (e) {
                consoleColor.error(e)
                if (e.message.indexOf('already exists') !== -1) {
                    consoleColor.green(`目录:${io.pathTool.resolve(subtree.prefix)} 已存在,请处理`)
                }
            }
        }
    }
    async isGitStatusOK() {
        const { stdout } = await exec('git status', { cwd, preventDefault: false })
        const result = stdout.indexOf('nothing to commit') !== -1
        if (!result) {
            consoleColor.red('请处理未提交的变更 git  commit -am <comment> ')
        }
        return result
    }
    async save(subtree: SubtreeModel) {
        const subtrees = await this.getSubtrees()
        subtrees.push(subtree)
        await io.write(subtreeFilePath, subtrees)
        consoleColor.green(`写入${subtreeFilePath}成功`, true)
    }
    async getSubtrees() {
        return JSON.parse(fs.readFileSync(subtreeFilePath).toString()).map(n => new SubtreeModel(n))
    }
    async init(force = false) {
        try {
            if (fs.existsSync(subtreeFilePath)) {
                const fileString = fs.readFileSync(subtreeFilePath).toString()
                const subtrees = JSON.parse(fileString)
            }
        } catch (e) {
            consoleColor.red(subtreeFilePath + ' 文件内容异常', false)
            consoleColor.error(e)
        }
        if (!fs.existsSync(subtreeFilePath) || force) {
            fs.writeFileSync(subtreeFilePath, stringify([]))
        }
    }
}