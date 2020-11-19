import { consoleColor } from '../lib'
export default {
    /**
     * 启动
     */
    async start(data) {
        console.log('hello cli')
    },
    command: ['开始', {
        // remove: {
        //     alias: ['r'],
        //     boolean: true,
        //     describe: 'describe'
        // },
        // lib: {
        //     alias: ['l'],
        //     boolean: true,
        //     default: false,
        //     describe: 'describe'
        // }
    }
    ]
}