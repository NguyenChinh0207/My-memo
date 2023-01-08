import React, { useState, useContext } from "react";
import { Layout, Menu, Avatar, Space, Dropdown } from "antd";
import { IconEng, IconVi } from "../common/Icon/Icon";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AUTH_TOKEN, EN, KEY_LANGUAGE, USER_INFO, VI } from "../config/const";
import { getCurrentLanguage } from "../config/function";
import i18n from "i18next";
import avatar from "../assets/img/avatar.png";
import {
  LogoutOutlined,
  NotificationOutlined,
  BellOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import { AppContext } from "../context/AppContext";
import "./PrivateLayout.scss";
import {
  COURSES_PATH,
  COURSE_DETAIL_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  USER_LOGIN,
  USER_REGISTER,
} from "../config/path";

const PrivateLayout = (props) => {
  const { children } = props;
  const { handleSelectLanguage, user_info } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleNotify, setVisibleNotify] = useState(false);
  console.log("user info", user_info, user_info?.username);
  const locale = getCurrentLanguage();

  const handleChangeLanguage = (e) => {
    localStorage.setItem(KEY_LANGUAGE, e.key);
    i18n.changeLanguage(e.key).then(() => {
      setVisible(false);
    });
    handleSelectLanguage(e.key);
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(USER_INFO);
    history.push(USER_LOGIN);
  };

  const menu = (
    <Menu onClick={handleChangeLanguage} selectedKeys={locale}>
      <Menu.Item key={VI}>
        <Avatar src={<IconVi />} />
      </Menu.Item>
      <Menu.Item key={EN}>
        <Avatar src={<IconEng />} />
      </Menu.Item>
    </Menu>
  );

  const menuUser = (
    <Menu>
      <Menu.Item key={"courseCreated"} icon={<FolderOpenOutlined />}>
        {t("Khóa học đã tạo")}
      </Menu.Item>
      <Menu.Item
        key={"logout"}
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        {t("logout")}
      </Menu.Item>
    </Menu>
  );

  const notifyList = (
    <Menu>
      <Menu.Item key={"notify"} icon={<NotificationOutlined />}>
        {t("notify")}
      </Menu.Item>
    </Menu>
  );

  const NavButton = (props) => {
    const active = props.isActive ? "ActiveButton" : "";
    return (
      <NavLink to={props.to} className={"NavButton " + `${active}`}>
        {props.children}
      </NavLink>
    );
  };

  const url = `${location.pathname}`.split("/")[2];
  const urlRouter = `${location.pathname}`;
  let buttons = (
    <>
      <div className="NavRow">
        <NavButton to={HOME_PATH} isActive={url === "home"}>
          {t("home")}
        </NavButton>
        <NavButton to={COURSES_PATH} isActive={url === "courses"}>
          {t("courses")}
        </NavButton>
        {/* <NavButton to='/groups' isActive={url === 'groups'}>Groups</NavButton> */}
      </div>
      <div>
        <Space size={"large"}>
          <Dropdown
            overlay={menu}
            trigger={["click"]}
            onOpenChange={(flag) => setVisible(flag)}
            open={visible}
          >
            <Avatar src={locale === VI ? <IconVi /> : <IconEng />} />
          </Dropdown>
          <Dropdown
            overlay={notifyList}
            trigger={["click"]}
            onOpenChange={(flag) => setVisibleNotify(flag)}
            open={visibleNotify}
          >
            <div style={{ position: "relative" }}>
              <Avatar
                style={{ color: "white" }}
                width={26}
                height={26}
                src={<BellOutlined />}
              />
              <span className="badge-up pointer">6</span>
            </div>
          </Dropdown>
          <Dropdown
            overlay={menuUser}
            trigger={["click"]}
            onOpenChange={(flag) => setVisibleLogout(flag)}
            open={visibleLogout}
          >
            <div className="avatar-swap pointer">
              <div style={{ position: "relative" }}>
                <Avatar width={26} height={26} src={avatar} />
                <span className="avatar-status-online"></span>
              </div>
              <span
                style={{ marginLeft: "4px" }}
                className="textColor username"
              >
                {user_info?.username}
              </span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </>
  );

  if (
    urlRouter === USER_LOGIN ||
    urlRouter === USER_REGISTER ||
    urlRouter === DASHBOARD_PATH
  ) {
    const loginBtnActive =
      urlRouter === USER_LOGIN ? "ActiveButtonLoginLogout" : "loginBtn";
    const signUpBtnActive =
      urlRouter === USER_REGISTER ? "ActiveButtonLoginLogout" : "SignUpPurple";

    buttons = (
      <div className="HeaderRow" style={{ justifyContent: "flex-end" }}>
        <div className="AuthNavButtonsDiv">
          <Space size={"large"}>
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              onOpenChange={(flag) => setVisible(flag)}
              open={visible}
            >
              <Avatar
                style={{ marginRight: "15px" }}
                src={locale === VI ? <IconVi /> : <IconEng />}
              />
            </Dropdown>
          </Space>
          <NavLink
            to={USER_LOGIN}
            className={"NavLoginSignup AuthNavButtonsDiv " + loginBtnActive}
          >
            {t("login:btn_login")}
          </NavLink>
          <NavLink
            to={USER_REGISTER}
            className={`NavLoginSignup LRMargin ${signUpBtnActive}`}
            style={{ color: "#2b3648" }}
          >
            {t("login:btn_signup")}
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <Layout style={{ minWidth: "100vh" }}>
      <div className="Header">
        <div className="HeaderWrap">
          <div className="HeaderRow">
            <NavLink to={HOME_PATH} className="LogoWrapper" />
            {buttons}
          </div>
        </div>
      </div>
      <Layout.Content style={{ marginTop: 62, minHeight: "100vh" }}>
        {children}
      </Layout.Content>
      <Layout.Footer
        style={{
          textAlign: "center",
        }}
      >
        My memo ©2022 Created by Chinh Nguyen
      </Layout.Footer>
    </Layout>
  );
};

export default PrivateLayout;
