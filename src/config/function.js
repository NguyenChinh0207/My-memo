import { camelCase } from "lodash";
import { encrypt, decrypt } from "crypto-js/aes";
import utf8 from "crypto-js/enc-utf8";
import {
  AUTH_TOKEN,
  DEFAULT_LANGUAGE,
  FILEBASE64,
  KEY_LANGUAGE,
  LANGUAGES,
  LANGUAGES_VOICES,
  SECRET_KEY,
  USER_INFO,
} from "./const";
import { getAxios } from "../Http";
import FileSaver from "file-saver";

// get current language
export const getCurrentLanguage = () => {
  const lang = localStorage.getItem(KEY_LANGUAGE);
  return lang ? lang : DEFAULT_LANGUAGE;
};

// get translate resource files
export const getTranslationFiles = (languages, translationFiles) => {
  const resources = {};
  for (let i = 0; i < languages.length; i++) {
    resources[languages[i]] = {};
    for (let j = 0; j < translationFiles.length; j++) {
      try {
        resources[languages[i]][
          camelCase(translationFiles[j])
        ] = require(`../locales/${languages[i]}/${translationFiles[j]}.json`);
      } catch (error) {}
    }
  }
  return resources;
};

export const bindParams = (str, params = {}) => {
  let result = str;
  for (let key in params) {
    result = result.replace(new RegExp(`:${key}`, "g"), params[key]);
  }
  return result;
};

export const isLogin = () => {
  return localStorage.getItem(AUTH_TOKEN) && localStorage.getItem(USER_INFO);
};

export const getAccessToken = () => {
  return localStorage.getItem(AUTH_TOKEN) || "";
};

export const getUserInfo = () => {
  const data = localStorage.getItem(USER_INFO);
  if (data) {
    try {
      const result = JSON.parse(decrypt(data, SECRET_KEY).toString(utf8));
      return result;
    } catch (e) {}
  }
};

export const saveAccessToken = (token) => {
  localStorage.setItem(AUTH_TOKEN, token || "");
};

export const saveUserInfo = (user) => {
  localStorage.setItem(
    USER_INFO,
    encrypt(JSON.stringify(user), SECRET_KEY).toString()
  );
};

export const scrollToErrorField = (errorFields) => {
  const el = document.getElementById(errorFields[0]?.name[0]);
  el?.scrollIntoView();
  window.scrollTo(0, window.scrollY - el.offsetHeight - 72);
};

export const scrollToErrorFieldByName = (name) => {
  const el = document.getElementById(name);

  if (!el) {
    return;
  }

  el.scrollIntoView();
  window.scrollTo(0, window.scrollY - el.offsetHeight - 72);
};

export const getRole = () =>
  localStorage.getItem("roleId") ? localStorage.getItem("roleId") : 0;

export const fetchList = async (endpoint, params) => {
  const { data } = await getAxios(endpoint, params);
  return data;
};

export const formatTime = (time) => {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time - minutes * 60);
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
};

export const shuffleArray = (array, arrLength) => {
  let i = array.length - 1;
  for (; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  if (arrLength < array.length) {
    let arrayRandom = [];
    for (let index = 0; index < arrLength; index++) {
      const element = array[index];
      arrayRandom.push(element);
    }
    return arrayRandom;
  }
  return array;
};

export const handleDownload = () => {
  let sliceSize = 1024;
  let byteCharacters = window.atob(FILEBASE64);
  let bytesLength = byteCharacters.length;
  let slicesCount = Math.ceil(bytesLength / sliceSize);
  let byteArrays = new Array(slicesCount);
  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    let begin = sliceIndex * sliceSize;
    let end = Math.min(begin + sliceSize, bytesLength);
    let bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  FileSaver.saveAs(
    new Blob(byteArrays, { type: "application/vnd.ms-excel" }),
    "exam-template.xlsx"
  );
};

export const optionLanguages = LANGUAGES.map((item) => ({
  value: item,
  label: item,
}));

export const optionVoices = LANGUAGES_VOICES.map((item) => ({
  value: item.id,
  label: item.name,
}));
