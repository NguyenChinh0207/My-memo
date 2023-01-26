import React, { useState, useContext } from "react";
import { Layout, Menu, Avatar, Space, Dropdown } from "antd";
import { IconEng, IconVi } from "../common/Icon/Icon";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AUTH_TOKEN,
  EN,
  KEY_LANGUAGE,
  ROLE_ADMIN,
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
} from "@ant-design/icons";
import { AppContext } from "../context/AppContext";
import "./PrivateLayout.scss";
import {
  COURSES_PATH,
  COURSE_DETAIL_PATH,
  COURSE_LIST_OWNER_PATH,
  DASHBOARD_PATH,
  HOME_PATH,
  USER_LOGIN,
  USER_REGISTER,
} from "../config/path";
import Sider from "antd/lib/layout/Sider";

const AdminLayout = (props) => {
  const { children } = props;
  const { handleSelectLanguage, user_info } = useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("common");
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);
  const [visibleNotify, setVisibleNotify] = useState(false);
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

  const handleCourses = () => {
    history.push(COURSE_LIST_OWNER_PATH);
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
      <Menu.Item
        key={"courseCreated"}
        icon={<FolderOpenOutlined />}
        onClick={handleCourses}
      >
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
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        theme={"dark"}
        breakpoint="lg"
        collapsedWidth="0"
        width={272}
        defaultCollapsed={window.innerWidth < "992"}
      >
        <div className="logo">image</div>
        {role === ROLE_ADMIN ? (
          <Menu
            defaultSelectedKeys={[
              `/${location.pathname.split("/")[1]}/${
                location.pathname.split("/")[2]
              }`,
            ]}
            mode="inline"
          >
            {menus.map((item) => (
              <Menu.Item key={item.key}>
                <NavLink to={item.key}>{item.name}</NavLink>
              </Menu.Item>
            ))}
          </Menu>
        ) : (
          <Menu
            defaultSelectedKeys={[
              `/${location.pathname.split("/")[1]}/${
                location.pathname.split("/")[2]
              }`,
            ]}
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            className="main-menu"
            onOpenChange={(openKeys) => setOpenMenus(openKeys)}
          >
            {menus.map((menu) => {
              return (
                <SubMenu key={menu.key} icon={menu.icon} title={menu.name}>
                  {menu.children.map((item) => {
                    const linkSplitted = item.key.split("/");
                    return (
                      <Menu.Item
                        key={[
                          linkSplitted[0],
                          linkSplitted[1],
                          linkSplitted[2],
                        ].join("/")}
                      >
                        <NavLink to={item.key}>{item.name}</NavLink>
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        )}
      </Sider>

      <Layout className="site-layout">
        {role && (
          <Layout.Header className="site-layout-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Breadcrumb style={{ margin: "16px 0" }}>
                  {breadcrumbs.map((item, key) => (
                    <Breadcrumb.Item
                      key={key}
                      className={
                        key === breadcrumbs.length - 2
                          ? "breadcrumb-separator-before-last"
                          : ""
                      }
                    >
                      {item}
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>
              <div>
                <Space size={"large"}>
                  <Dropdown
                    overlay={menu}
                    trigger={["click"]}
                    onVisibleChange={(flag) => setVisible(flag)}
                    visible={visible}
                  >
                    <Avatar src={locale === VI ? <IconVi /> : <IconEng />} />
                  </Dropdown>
                  <Dropdown
                    overlay={menuUser}
                    trigger={["click"]}
                    onVisibleChange={(flag) => setVisibleLogout(flag)}
                    visible={visibleLogout}
                  >
                    <Avatar width={30} height={30} src={avatar} />
                  </Dropdown>
                </Space>
              </div>
            </div>
          </Layout.Header>
        )}
        <Layout.Content style={{ margin: 16 }}>{children}</Layout.Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
