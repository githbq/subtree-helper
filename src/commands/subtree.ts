import { exec, consoleColor, io, stringify } from '../lib'
import * as fs from 'fs'

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
export default {
    /**
     * 启动
     */
    async start(data) {
        consoleColor.green(
            `
配置文件示例:
${stringify([new SubtreeModel({ prefix: 'common', url: 'http://', alias: 'lib1', branch: 'master' })])}
配置文件示例结束          
`
        )
        this.init()
        switch (data.task) {
            case 'init':
                // this.init(true)
                break
            case 'add':
                this.add()
                break
            case 'pull':
                this.pull()
                break
            case 'push':
                this.push()
                break
        }

    },
    async pull() {
        //git subtree pull --prefix=<子目录名> <远程地址> <分支> --squash
        const subtrees = await this.getSubtrees()
        for (let subtree of subtrees) {
            await exec(`git subtree pull --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch} --squash`)
        }
    },
    async push(subtree: SubtreeModel) {
        //git subtree push --prefix=<子目录名> <远程地址> 分支
        await exec(`git subtree push --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch}`)
    },
    async add() {
        console.log('--add')
        //git subtree add --prefix=<子目录名> <子仓库地址> <分支> --squash
        const subtrees = await this.getSubtrees()

        for (let subtree of subtrees) {
            try {
                const cmdStr = `git subtree add --prefix=${subtree.prefix} ${subtree.url} ${subtree.branch} --squash`
                consoleColor.start(cmdStr)
                await exec(cmdStr, {
                    onStdout(msg) { consoleColor.green(msg) },
                    onStderr(msg) { consoleColor.green(msg, false) }
                })
            } catch (e) {
                consoleColor.error(e.message)
            }
        }
    },
    async save(subtree: SubtreeModel) {
        const subtrees = await this.getSubtrees()
        subtrees.push(subtree)
        await io.write(subtreeFilePath, subtrees)
        consoleColor.green(`写入${subtreeFilePath}成功`, true)
    },
    async getSubtrees() {
        console.log('ddsdd', JSON.parse(fs.readFileSync(subtreeFilePath).toString()))
        return JSON.parse(fs.readFileSync(subtreeFilePath).toString()).map(n => new SubtreeModel(n))
    },
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
    },
    command: [
        `<task>`,
        'subtree 操作',
        {
            init: {
                alias: 'i',
                describe: '初始化',
                boolean: true,
                default: false
            },
            add: {
                alias: 'a',
                describe: '添加subtree',
                number: true,
                default: 2
            },
            pull: {
                describe: '更新subtree',
                number: true,
                default: 2
            },
            push: {
                describe: '提交subtree',
                number: true,
                default: 2
            }
        }
    ]
}