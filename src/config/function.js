import { camelCase } from 'lodash'
import {
    AUTH_TOKEN,
    DEFAULT_LANGUAGE,
    KEY_LANGUAGE,
    USER_INFO,
    PAGE_LIMIT,
    SCROLL_TO_ID,
} from './const'
import { getAxios } from '../Http'

// get current language
export const getCurrentLanguage = () => {
    const lang = localStorage.getItem(KEY_LANGUAGE)
    return lang ? lang : DEFAULT_LANGUAGE
}

// get translate resource files
export const getTranslationFiles = (languages, translationFiles) => {
    const resources = {}
    for (let i = 0; i < languages.length; i++) {
        resources[languages[i]] = {}
        for (let j = 0; j < translationFiles.length; j++) {
            try {
                resources[languages[i]][
                    camelCase(translationFiles[j])
                ] = require(`../locales/${languages[i]}/${translationFiles[j]}.json`)
            } catch (error) { }
        }
    }
    return resources
}

export const bindParams = (str, params = {}) => {
    let result = str
    for (let key in params) {
        result = result.replace(new RegExp(`:${key}`, 'g'), params[key])
    }
    return result
}

export const isLogin = () => {
    return !!localStorage.getItem(AUTH_TOKEN) && !!localStorage.getItem(USER_INFO)
}

export const scrollToErrorField = (errorFields) => {
    const el = document.getElementById(errorFields[0]?.name[0])
    el?.scrollIntoView()
    window.scrollTo(0, window.scrollY - el.offsetHeight - 72)
}

export const scrollToErrorFieldByName = (name) => {
    const el = document.getElementById(name)

    if (!el) {
        return
    }

    el.scrollIntoView()
    window.scrollTo(0, window.scrollY - el.offsetHeight - 72)
}

export const getRole = () =>
    localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')).rk_role_id : null  // ROLE_ADMIN

export const fetchList = async (endpoint, params) => {
    const { data } = await getAxios(endpoint, params)
    return data
}