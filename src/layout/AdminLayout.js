import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  Layout,
  Menu,
  Breadcrumb,
  Avatar,
  Space,
  Dropdown,
  Image,
  Tooltip,
} from "antd";
import { SolutionOutlined, UserOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { IconEng, IconVi } from "../common/Icon/Icon";
import { NavLink, useHistory, useLocation } from "react-router-dom";
import {
  USER_LOGIN,
  ADMIN_USER_LIST_PATH,
  ADMIN_COURSE_LIST_PATH,
  ADMIN_MY_COURSE_LIST_PATH,
} from "../config/path";
import { useTranslation } from "react-i18next";
import {
  AUTH_TOKEN,
  EN,
  JA,
  KEY_LANGUAGE,
  USER_INFO,
  VI,
} from "../config/const";
import { getCurrentLanguage, getRole } from "../config/function";
import i18n from "i18next";
import avatar from "../assets/img/avatar.png";
import { LogoutOutlined, BookOutlined } from "@ant-design/icons";
import { AppContext } from "../context/AppContext";
import "./AdminLayout.scss";
import img from "../assets/img/logoIcon.PNG";
import IconJapan from "../common/Icon/IconJapan";

const { SubMenu } = Menu;

// Layout Admin
const AdminLayout = (props) => {
  const { breadcrumbs, children } = props;
  const { handleSelectLanguage, openedMenus, user_info } =
    useContext(AppContext);
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("adminLayout");
  const role = getRole();
  const [visible, setVisible] = useState(false);
  const [visibleLogout, setVisibleLogout] = useState(false);

  const locale = getCurrentLanguage();

  let menus = [
    {
      key: ADMIN_USER_LIST_PATH,
      name: t("user_list"),
      icon: <UserOutlined />,
    },
    {
      key: ADMIN_COURSE_LIST_PATH,
      name: t("course_list"),
      icon: <SolutionOutlined />,
    },
    {
      key: ADMIN_MY_COURSE_LIST_PATH,
      name: t("created_course_list"),
      icon: <BookOutlined />,
    },
  ];

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
    localStorage.removeItem("roleId");
    history.push(USER_LOGIN);
  };

  const menu = (
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

  const menuUser = (
    <Menu onClick={handleLogout}>
      <Menu.Item key={"logout"} icon={<LogoutOutlined />}>
        {t("logout")}
      </Menu.Item>
    </Menu>
  );

  const selectedKey = `/${location.pathname.split("/")[1]}/${
    location.pathname.split("/")[2]
  }`;
  const openMenu = menus.find((menu) => {
    const childIndex = menu?.children?.findIndex((item) => {
      return item?.key?.includes(selectedKey);
    });
    return childIndex !== -1;
  });

  const openKey = openMenu ? openMenu.key : "lifestyle";

  let defaultOpenKeys = openedMenus;
  if (openedMenus.indexOf(openKey) === -1) {
    defaultOpenKeys = [...openedMenus, openKey];
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
        <div className="LogoWrapperAdmin">
          <Image src={img} className="Logo" />
        </div>
        <Menu
          selectedKeys={[
            `/${location.pathname.split("/")[1]}/${
              location.pathname.split("/")[2]
            }`,
          ]}
          mode="inline"
          items={menus.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <NavLink to={item.key}>{item.name}</NavLink>,
          }))}
        />
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
                    onOpenChange={(flag) => setVisible(flag)}
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
                    overlay={menuUser}
                    trigger={["click"]}
                    onOpenChange={(flag) => setVisibleLogout(flag)}
                    open={visibleLogout}
                  >
                    <Space size={"small"}>
                      <Avatar width={30} height={30} src={avatar} />
                      <div>
                        <span className="textColor username pointer">
                          {user_info?.username}
                        </span>
                      </div>
                    </Space>
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

AdminLayout.defaultProps = {
  breadcrumbs: [],
};

AdminLayout.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
};

export default AdminLayout;
