import axios from 'axios'
import { Message } from 'element-ui'

axios.interceptors.response.use(
    success => {
        if (success.status && success.status == 200) {
            return success.data
        } else {
            Message.error({message: success.data.message})
        }
    },
    error => {
        Message.error({message: error.response.data.message})
        return
    }
)

export const getRequest = url => {
    return axios({
        method: 'get',
        url: url
    })
}

export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: url,
        data: params,
        transformRequest: [ transformRequest ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: url,
        data: params,
        transformRequest: [ transformRequest ],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

export const deleteRequest = url => {
    return axios({
        method: 'delete',
        url: url
    })
}

// 请求参数格式化
const transformRequest = data => {
    let ret = '';
    for (let key in data) {
        let value = data[key]
        if (value) {
            ret += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
        }
    }
    return ret;
}