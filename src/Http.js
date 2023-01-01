import axios from 'axios'
import qs from 'qs'
import { AUTH_TOKEN, USER_INFO } from './config/const'
import { getCurrentLanguage } from './config/function'
import { USER_LOGIN } from './config/path'

/**
 * Get access token
 */
export const getToken = () => {
    return localStorage.getItem('auth_token') ? localStorage.getItem('auth_token') : ''
}

// GLOBAL DEFAULT
axios.defaults.headers.common["Access-Control-Allow-Origin"] =
    "http://localhost:5000";
axios.defaults.headers.common["Access-Control-Allow-Methods"] =
  "HEAD, GET, POST, PUT, DELETE";
axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true
axios.defaults.headers.common["Cache-Control"] = "no-cache";
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['Cache-Control'] = 'max-age=0'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
const API_WEMAP = `${process.env.REACT_APP_WEMAP_API}/search?text=`

export const fetchData = async (keyword) => {
    try {
        const response = await fetch(`${API_WEMAP}${keyword}`)
        return await response.json()
    } catch (err) {
        return err
    }
}

// get fuction handler un-authenticate request
export function getAxios(url, params, configs = {}) {
    axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${getToken()}`
    axios.defaults.headers.common['lang'] = getCurrentLanguage()

    return new Promise((resolve, reject) => {
        axios
            .get(
                url,
                {
                    params,
                    paramsSerializer: (params) => {
                        return qs.stringify(params, { arrayFormat: 'repeat' })
                    },
                    ...configs,
                }
                // configRequest
            )
            .then((response) => {
                if (response.data.code === 401 || (response.status !== 200 && response.data.code === 403)) {
                    localStorage.removeItem(AUTH_TOKEN)
                    localStorage.removeItem(USER_INFO)
                    window.location = USER_LOGIN
                }
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @param {*} url
 * @param {*} body
 * @param config
 * @param isAuth
 */
export function postAxios(url, body, config = {}, isAuth = true) {
    axios.defaults.headers.common["Access-Control-Allow-Credentials"] = true;
    axios.defaults.headers.common["AUTHORIZATION"] = `Bearer ${getToken()}`;
    axios.defaults.headers.common['lang'] = getCurrentLanguage()

    if (!isAuth) {
        axios.defaults.headers.common['AUTHORIZATION'] = null
        axios.defaults.headers.common['CLIENTAPIKEY'] = null
    }
    return new Promise((resolve, reject) => {
        axios
            .post(url, body, config)
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @param {*} url
 * @param config
 */
export function deleteAxios(url, config = {}) {
    axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${getToken()}`
    axios.defaults.headers.common['lang'] = getCurrentLanguage()

    return new Promise((resolve, reject) => {
        axios
            .delete(url, config)
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

/**
 * @param {*} url
 * @param {*} body
 * @param config
 */
export function putAxios(url, body, config = {}) {
    axios.defaults.headers.common['AUTHORIZATION'] = `Bearer ${getToken()}`
    axios.defaults.headers.common['lang'] = getCurrentLanguage()

    return new Promise((resolve, reject) => {
        axios
            .put(url, body, config)
            .then((response) => {
                resolve(response.data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
