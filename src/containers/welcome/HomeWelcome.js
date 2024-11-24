import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { NavLink } from "react-router-dom";
import './HomeWelcome.scss'
import PrivateLayout from '../../layout/PrivateLayout'
import { USER_LOGIN } from '../../config/path'

const HomeWelcome = () => {
  const { t } = useTranslation("homeLayout");
  return (
    <PrivateLayout>
      <div className="wrapper">
        <div className="wrapper-banner">
          <div className="banner" />
          <div className="u-align-left u-container-style u-layout-cell u-size-24 u-layout-cell-2">
            <div className="u-container-layout u-valign-middle u-container-layout-2">
              <h1 className="u-text u-text-palette-2-base u-text-1">
                {t("learn_title")}
              </h1>
              <p className="u-text u-text-2">{t("welcome_to_dashboard")}</p>
              <NavLink
                to={USER_LOGIN}
                className="u-active-palette-2-base u-border-2 u-border-active-palette-2-base u-border-hover-palette-2-base u-border-palette-2-base u-btn u-btn-round u-button-style u-hover-palette-2-base u-none u-radius-50 u-text-active-white u-text-black u-text-hover-white u-btn-2"
              >
                {t("start_learn")}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
};

export default HomeWelcome;
