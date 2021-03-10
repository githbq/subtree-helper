# axios-ajax

## 功能介绍
1. 针对axios使用二次封装，更友好的发请求 
2. 对外输出 axiosInstance 与 restful 对象, axios 为新实例对象  

## 安装
```
npm install axios-ajax
```

## 使用 
```js
// 内部默认axios参数
// const defaultOptions = {
//     method: 'get', // method:  get post delete put patch
//     withCredentials: true, // 设置该属性可以把 cookie 信息传到后台 
//     headers: {
//         // headers 的键是不区分大小写的
//         Accept: 'application/json',
//         //'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
//         'Content-Type': 'application/json; charset=utf-8'
//     },
//     data: null
// }

import {axiosInstance,restful,setInstanceDefaultOptions} from 'axios-ajax' 
// 可以使用setInstanceDefaultOptions(axiosRequestConfig)函数追加的默认参数

// 第一个参数为url,第二个参数为数据，第三个参数为原生 axios requestConfig
// 默认baseURL为" 'api/' ,可以通过第三个参数进行修改
//restful[method](url,data,axiosRequestConfig) 
const response = await restful.get('getUser',{a:1,b:2}) // 发送GET api/getUser?a=1&b=2 请求
const response = await restful.post('http://www.com/getUser',{a:1,b:2}) // 发送POST http://www.com/getUser 请求
const response = await restful.put('http://www.com/api',{a:1,b:2})
const response = await restful.delete('http://www.com/api',{a:1,b:2})
const response = await restful.patch('http://www.com/api',{a:1,b:2})
const response = await restful.request(axiosOriginReqeuestConfig)
// axiosInstance 为axios实例对象，
// 你可以继续使用请求与响应拦截器：
// axiosInstance.interceptors.request.use(requestConfig => {},error => {})
// axiosInstance.interceptors.response.use(response => {},error=>{})

```
## restful 动词介绍
 ```
// GET（SELECT）：从服务器取出资源（一项或多项）。
// POST（CREATE）：在服务器新建一个资源。
// PUT（UPDATE）：在服务器更新资源（客户端提供改变后的完整资源）。
// PATCH（UPDATE）：在服务器更新资源（客户端提供改变的属性）。
// DELETE（DELETE）：从服务器删除资源。
 ```

相关 restful api 介绍链接:<http://www.ruanyifeng.com/blog/2014/05/restful_api.html>