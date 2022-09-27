import React, { createContext, useState } from 'react'
import { DEFAULT_LANGUAGE, MENU_KEY } from '../config/const'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('language') || DEFAULT_LANGUAGE)

    const menuKeys = JSON.parse(localStorage.getItem(MENU_KEY))
    const [openedMenus, setOpenedMenus] = useState(Array.isArray(menuKeys) ? menuKeys : [])

    const handleSelectLanguage = (value) => {
        setSelectedLanguage(value)
    }

    const setOpenMenus = (keys) => {
        setOpenedMenus(keys)
        localStorage.setItem(MENU_KEY, JSON.stringify(keys))
    }

    return (
        <AppContext.Provider
            value={{
                selectedLanguage,
                openedMenus,
                handleSelectLanguage,
                setOpenMenus,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export default AppContextProvider
