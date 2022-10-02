import React, { createContext, useState } from 'react'
import { DEFAULT_LANGUAGE } from '../config/const'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || DEFAULT_LANGUAGE)

    const handleSelectLanguage = (value) => {
        setSelectedLanguage(value)
    }

    return (
        <AppContext.Provider
            value={{
                selectedLanguage,
                handleSelectLanguage,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
