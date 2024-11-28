import React, { useState, useContext } from "react";
import { Layout, Menu, Avatar, Space, Dropdown, Tooltip } from "antd";
import { IconEng, IconVi } from "../common/Icon/Icon";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AUTH_TOKEN,
  EN,
  JA,
  KEY_LANGUAGE,
  USER_INFO,
  VI,
} from "../config/const";
import { getCurrentLanguage } from "../config/function";
import i18n from "i18next";
import avatar from "../assets/img/avatar.png";
import {
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
  FolderOpenOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { AppContext } from "../context/AppContext";
import "./PrivateLayout.scss";
import {
  COURSES_PATH,
  COURSE_LIST_OWNER_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  USER_LOGIN,
  USER_REGISTER,
} from "../config/path"; 
import IconJapan from "../common/Icon/IconJapan";
import ChangePassword from "../containers/auth/ChangePassword";

const PrivateLayout = ({ children }) => {
  const { handleSelectLanguage, user_info } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("homeLayout");

  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleNotify, setVisibleNotify] = useState(false);
  const [isChangeForgotPasswordModalOpen, setIsChangeForgotPasswordModalOpen] =
    useState(false);

  const locale = getCurrentLanguage();

  // change language
  const handleChangeLanguage = (e) => {
    localStorage.setItem(KEY_LANGUAGE, e.key);
    i18n.changeLanguage(e.key).then(() => {
      setVisible(false);
    });
    handleSelectLanguage(e.key);
  };

  const handleChangePassword = () => {
    setIsChangeForgotPasswordModalOpen((prev) => !prev);
  };
  const handleModalClose = () => {
    setIsChangeForgotPasswordModalOpen(false); 
  };

  // logout
  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(USER_INFO);
    history.push(USER_LOGIN);
  };

  const handleCourses = () => {
    history.push(COURSE_LIST_OWNER_PATH);
  };

  // Menu change language
  const renderLanguageMenu = () => (
    <Menu onClick={handleChangeLanguage} selectedKeys={locale}>
      <Menu.Item key={EN}>
        <Avatar src={<IconEng />} />
      </Menu.Item>
      <Menu.Item key={VI}>
        <Avatar src={<IconVi />} />
      </Menu.Item>
      <Menu.Item key={JA}>
        <Avatar src={<IconJapan />} />
      </Menu.Item>
    </Menu>
  );

  // Menu user
  const renderUserMenu = () => (
    <Menu>
      <Menu.Item
        key="courseCreated"
        icon={<FolderOpenOutlined />}
        onClick={handleCourses}
      >
        {t("courses_created")}
      </Menu.Item>
      <Menu.Item key="changePassword" icon={<SettingOutlined />} onClick={handleChangePassword}>
        {t("auth:change_password_title")}
      </Menu.Item>
      <ChangePassword triggerModal={isChangeForgotPasswordModalOpen} onModalClose={handleModalClose} />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        {t("btn_logout")}
      </Menu.Item>
    </Menu>
  );

  // Menu notify
  const renderNotifyMenu = () => (
    <Menu>
      <Menu.Item key="notify" icon={<NotificationOutlined />}>
        {t("notify")}
      </Menu.Item>
    </Menu>
  );

  // Navigation button
  const NavButton = ({ to, isActive, children }) => (
    <NavLink to={to} className={`NavButton ${isActive ? "ActiveButton" : ""}`}>
      {children}
    </NavLink>
  );

  // View
  const url = location.pathname.split("/")[2];
  const urlRouter = location.pathname;

  const renderHeaderButtons = () => {
    if ([USER_LOGIN, USER_REGISTER, DASHBOARD_PATH].includes(urlRouter)) {
      return (
        <div className="AuthNavButtonsDiv">
          <Space size="large" style={{ marginRight: "12px" }}>
            <Dropdown
              overlay={renderLanguageMenu()}
              trigger={["click"]}
              onOpenChange={setVisible}
              open={visible}
            >
              <Avatar
                src={
                  locale === VI ? (
                    <IconVi />
                  ) : locale === EN ? (
                    <IconEng />
                  ) : (
                    <IconJapan />
                  )
                }
              />
            </Dropdown>
          </Space>
          <NavLink
            to={USER_LOGIN}
            className={`NavLoginSignup ${
              urlRouter === USER_LOGIN ? "ActiveButtonLoginLogout" : ""
            }`}
          >
            {t("btn_login")}
          </NavLink>
          <NavLink
            to={USER_REGISTER}
            className={`NavLoginSignup LRMargin ${
              urlRouter === USER_REGISTER
                ? "ActiveButtonLoginLogout"
                : "SignUpPurple"
            }`}
            style={{ color: "#2b3648" }}
          >
            {t("btn_signup")}
          </NavLink>
        </div>
      );
    }

    return (
      <div className="NavRow">
        <div className="d-flex">
          <NavButton to={HOME_PATH} isActive={url === "home"}>
            {t("home")}
          </NavButton>
          <NavButton to={COURSES_PATH} isActive={url === "courses"}>
            {t("courses")}
          </NavButton>
        </div>
        <Space size="large">
          <Dropdown
            overlay={renderLanguageMenu()}
            trigger={["click"]}
            onOpenChange={setVisible}
            open={visible}
          >
            <Avatar
              src={
                locale === VI ? (
                  <IconVi />
                ) : locale === EN ? (
                  <IconEng />
                ) : (
                  <IconJapan />
                )
              }
            />
          </Dropdown>
          <Dropdown
            overlay={renderNotifyMenu()}
            trigger={["click"]}
            onOpenChange={setVisibleNotify}
            open={visibleNotify}
          >
            <div style={{ position: "relative" }}>
              <Avatar
                style={{ color: "white" }}
                width={26}
                height={26}
                src={<BellOutlined />}
              />
              <span className="badge-up pointer">0</span>
            </div>
          </Dropdown>
          <Dropdown
            overlay={renderUserMenu()}
            trigger={["click"]}
            onOpenChange={setVisibleLogout}
            open={visibleLogout}
          >
            <div className="avatar-swap pointer">
              <div style={{ position: "relative" }}>
                <Avatar width={26} height={26} src={avatar} />
                <span className="avatar-status-online"></span>
              </div>
              <div>
                <span
                  style={{ marginLeft: "4px" }}
                  className="textColor username"
                >
                  {user_info?.username}
                </span>
              </div>
            </div>
          </Dropdown>
        </Space>
      </div>
    );
  };

  return (
    <Layout style={{ minWidth: "100vh" }} className="PrivateLayout">
      <div className="Header">
        <div className="HeaderWrap">
          <div className="HeaderRow">
            <NavLink to={HOME_PATH} className="LogoWrapper" />
            {renderHeaderButtons()}
          </div>
        </div>
      </div>
      <Layout.Content style={{ marginTop: 62, minHeight: "100vh" }}>
        {children}
      </Layout.Content>
      <Layout.Footer style={{ textAlign: "center" }}>
        {t("common:author_created")}
      </Layout.Footer>
    </Layout>
  );
};

export default PrivateLayout;
