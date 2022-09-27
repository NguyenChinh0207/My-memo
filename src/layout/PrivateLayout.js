import React, { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Layout, Menu, Breadcrumb, Avatar, Space, Dropdown } from 'antd'
import {
    RobotOutlined,
} from '@ant-design/icons'
import Sider from 'antd/es/layout/Sider'
import { IconEng, IconVi } from '../common/Icon/Icon'
import { NavLink, useHistory, useLocation } from 'react-router-dom'
import {
    ADMIN_LOGIN, 
} from '../config/path'
import { useTranslation } from 'react-i18next'
import {
    AUTH_TOKEN,
    EN,
    KEY_LANGUAGE,
    USER_INFO,
    VI,
    MENU_KEY,
} from '../config/const'
import { getCurrentLanguage, getMallId, getRole } from '../config/function'
import i18n from 'i18next'
// import avatar from '../assets/img/avatar.png'
import { LogoutOutlined } from '@ant-design/icons'
import { postAxios } from '../Http'
import { AppContext } from '../context/AppContext'

const { SubMenu } = Menu

const PrivateLayout = (props) => {
    const { breadcrumbs, children } = props
    const { handleSelectLanguage, openedMenus, setOpenMenus } = useContext(AppContext)
    const history = useHistory()
    const location = useLocation()
    const { t } = useTranslation('common')
    const role = getRole()
    const [visible, setVisible] = useState(false)
    const [visibleLogout, setVisibleLogout] = useState(false)

    const locale = getCurrentLanguage()

    let menus = [
        {
            key: 'lifestyle',
            name: t('Lifestyle'),
            children: [
            ],
            icon: <RobotOutlined />,
        },
    ]

    const handleChangeLanguage = (e) => {
        localStorage.setItem(KEY_LANGUAGE, e.key)
        i18n.changeLanguage(e.key).then(() => {
            setVisible(false)
        })
        handleSelectLanguage(e.key)
    }

    const handleLogout = () => {
        // postAxios(API_LOGOUT, {}).then(() => {
        //     localStorage.removeItem(AUTH_TOKEN)
        //     localStorage.removeItem(USER_INFO)
        //     localStorage.removeItem(MENU_KEY)
        //     history.push(ADMIN_LOGIN)
        // })
    }

    const menu = (
        <Menu onClick={handleChangeLanguage} selectedKeys={locale}>
            <Menu.Item key={VI}>
                <Avatar src={<IconVi />} />
            </Menu.Item>
            <Menu.Item key={EN}>
                <Avatar src={<IconEng />} />
            </Menu.Item>
        </Menu>
    )

    const menuUser = (
        <Menu onClick={handleLogout}>
            <Menu.Item key={'logout'} icon={<LogoutOutlined />}>
                {t('logout')}
            </Menu.Item>
        </Menu>
    )

    const selectedKey = `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}`
    const openMenu = menus.find((menu) => {
        const childIndex = menu?.children?.findIndex((item) => {
            return item?.key?.includes(selectedKey)
        })

        return childIndex !== -1
    })

    const openKey = openMenu ? openMenu.key : 'lifestyle'

    let defaultOpenKeys = openedMenus
    if (openedMenus.indexOf(openKey) === -1) {
        defaultOpenKeys = [...openedMenus, openKey]
    }

    return (
        <Layout style={{ minHeight: '100vh' }} >
                <Sider
                    theme={'dark'}
                    breakpoint="lg"
                    collapsedWidth="0"
                    width={272}
                    defaultCollapsed={window.innerWidth < '992'}
                >
                    <div
                        className="logo"
                        // onClick={() => history.push(role !== ROLE_PARKING_ADMIN ? CUSTOMER_PATH : SEARCH_PARKING_PATH)}
                    // onClick={() => history.push(DASHBOARD)}
                    >
                        {/* {genLogo()} */}
                    </div>
                    (
                        <Menu
                            defaultSelectedKeys={[
                                `/${location.pathname.split('/')[1]}/${location.pathname.split('/')[2]}`,
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
                                            const linkSplitted = item.key.split('/')
                                            return (
                                                <Menu.Item
                                                    key={[linkSplitted[0], linkSplitted[1], linkSplitted[2]].join('/')}
                                                >
                                                    <NavLink to={item.key}>{item.name}</NavLink>
                                                </Menu.Item>
                                            )
                                        })}
                                    </SubMenu>
                                )
                            })}
                        </Menu>
                    )
                </Sider>

            <Layout className="site-layout">
                {role && (
                    <Layout.Header className="site-layout-header">
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <div>
                                <Breadcrumb style={{ margin: '16px 0' }}>
                                    {breadcrumbs.map((item, key) => (
                                        <Breadcrumb.Item
                                            key={key}
                                            className={
                                                key === breadcrumbs.length - 2 ? 'breadcrumb-separator-before-last' : ''
                                            }
                                        >
                                            {item}
                                        </Breadcrumb.Item>
                                    ))}
                                </Breadcrumb>
                            </div>
                            <div>
                                <Space size={'large'}>
                                    <Dropdown
                                        overlay={menu}
                                        trigger={['click']}
                                        onVisibleChange={(flag) => setVisible(flag)}
                                        visible={visible}
                                    >
                                        <Avatar src={locale === VI ? <IconVi /> : <IconEng />} />
                                    </Dropdown>
                                    <Dropdown
                                        overlay={menuUser}
                                        trigger={['click']}
                                        onVisibleChange={(flag) => setVisibleLogout(flag)}
                                        visible={visibleLogout}
                                    >
                                        {/* <Avatar width={30} height={30} src={avatar} /> */}
                                    </Dropdown>
                                </Space>
                            </div>
                        </div>
                    </Layout.Header>
                )}
                <Layout.Content style={{ margin: 16 }} >
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    )
}

PrivateLayout.defaultProps = {
    breadcrumbs: [],
}

PrivateLayout.propTypes = {
    breadcrumbs: PropTypes.array.isRequired,
}
export default PrivateLayout
