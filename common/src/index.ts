import * as qs from 'qs'
import axios from 'axios'

const contentTypes = {
    json: 'application/json; charset=utf-8',
    urlencoded: 'application/x-www-form-urlencoded; charset=UTF-8'
}

// GET（SELECT）：从服务器取出资源（一项或多项）。
// POST（CREATE）：在服务器新建一个资源。
// PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
// PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
// DELETE（DELETE）：从服务器删除资源。 
const defaultOptions = {
    method: 'get', // method:  get post delete put patch
    withCredentials: true, // 设置该属性可以把 cookie 信息传到后台 
    headers: {
        // headers 的键是不区分大小写的
        Accept: 'application/json',
        //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Type': contentTypes.json
    },
    baseURL: 'api/',
    data: null
}
const axiosInstance = axios.create({
    timeout: 15000, // 请求超时时间
})

let instanceDefaultOptions = {}
const setInstanceDefaultOptions = (options) => {
    instanceDefaultOptions = options || {}
}

function callApi({
    url,
    data = {},
    options = {},
    contentType = ''
}) {
    if (!url) {
        const error = new Error('请传入 url')
        return Promise.reject(error)
    }
    const newOptions = { ...defaultOptions, ...instanceDefaultOptions, ...options }
    if (contentType === 'urlencoded') {
        newOptions.headers = {
            ...newOptions.headers,
            'Content-Type': contentTypes.urlencoded,

        }
    } else if (contentType === 'json') {
        newOptions.headers = {
            ...newOptions.headers,
            Accept: 'application/json',
            'Content-Type': contentTypes.json,

        }
    }
    const { method } = newOptions
    if (['get', 'head'].indexOf(method) === -1) {
        newOptions.data = data
        if (data instanceof FormData) {
            (newOptions.headers as any) = {
                'x-requested-with': 'XMLHttpRequest',
                'cache-control': 'no-cache',
            }
        } else if (((newOptions.headers[method] || newOptions.headers)['Content-Type'] || '').indexOf('x-www-form-urlencoded') !== -1) {
            if (typeof data !== 'string') {
                newOptions.data = qs.stringify(data || {})
            }
        }
    }


    return (axiosInstance as any)({
        url,
        ...newOptions,
    })
}

const restful = {
    request(config, contentType) {
        return callApi({
            url: config.url, options: { method: 'get', ...config }, contentType
        })
    },
    get(url, params, options, contentType) {
        return callApi({
            url, options: { params, method: 'get', ...options }, contentType
        })
    },

    post(url, data, options, contentType) {
        return callApi({ url, data, options: { method: 'post', ...options }, contentType })
    },
    put(url, data, options, contentType) {
        return callApi({ url, data, options: { method: 'put', ...options }, contentType })
    },
    delete(url, data, options, contentType) {
        return callApi({ url, data, options: { method: 'delete', ...options }, contentType })
    },
    patch(url, data, options, contentType) {
        return callApi({ url, data, options: { method: 'patch', ...options }, contentType })
    },
}

export {
    setInstanceDefaultOptions,
    axiosInstance,
    restful,
    contentTypes
} 
