import React, { createContext, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, MENU_KEY, USER_INFO } from "../config/const";
import { getUserInfo } from "../config/function";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || DEFAULT_LANGUAGE
  );
  const [user_info, setUserInfo] = useState(getUserInfo() || {});

  const menuKeys = JSON.parse(localStorage.getItem(MENU_KEY));
  const [openedMenus, setOpenedMenus] = useState(
    Array.isArray(menuKeys) ? menuKeys : []
  );

  const setOpenMenus = (keys) => {
    setOpenedMenus(keys);
    localStorage.setItem(MENU_KEY, JSON.stringify(keys));
  };

  const handleSelectLanguage = (value) => {
    setSelectedLanguage(value);
  };
  const value = useMemo(
    () => ({
      user_info,
      setUserInfo,
      selectedLanguage,
      handleSelectLanguage,
      openedMenus,
      setOpenMenus
    }),
    [selectedLanguage, user_info]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
