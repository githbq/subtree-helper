import core from '../core'

export default {
    /**
     * 主函数
     */
    async start(data) {
        await core.start({ task: 'status' })
    },
    command: [
        'test',
        {
        }
    ]
}