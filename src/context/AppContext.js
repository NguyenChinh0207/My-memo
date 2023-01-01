import React, { createContext, useState } from 'react'
import { AUTH_TOKEN, DEFAULT_LANGUAGE, USER_INFO } from '../config/const'
import jwt_decode from "jwt-decode";
import { getUserInfo } from '../config/function';

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || DEFAULT_LANGUAGE)
    const user = localStorage.getItem(USER_INFO);
    const user_info = user ? getUserInfo(): {};
    const handleSelectLanguage = (value) => {
        setSelectedLanguage(value)
    }

    return (
        <AppContext.Provider
            value={{
                user_info,
                selectedLanguage,
                handleSelectLanguage,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
