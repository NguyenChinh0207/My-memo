import React, { useState } from 'react'
// import bg from '../../assets/img/auth/login_bg.png'
import { Button, Col, Form, Input, Layout, notification, Space, Typography } from 'antd'
import Row from 'antd/es/grid/row'
import './Login.scss'
import { IconLogo } from '../../common/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { NavLink, useHistory } from 'react-router-dom'
// import { ADMIN_FORGOT_PASSWORD} from '../../config/path'
import { bindParams } from '../../config/function'
import axios from 'axios'
// import { API_ADMIN_LOGIN } from '../../config/endpointApi'
import { CODE_ERROR_EMAIL_PASSWORD_NOT_CORRECT, ROLE_HEAD_SHOP, ROLE_PARKING_ADMIN } from '../../config/const'

const Login = () => {
    const { t } = useTranslation('login')

    const history = useHistory()

    const [loading, setLoading] = useState(false)

    const [isInvalidEmailPassword, setIsInvalidEmailPassword] = useState(false)

    const onValuesChange = () => {
        if (isInvalidEmailPassword) {
            setIsInvalidEmailPassword(false)
        }
    }

    const onFinish = async (data) => {
        // setLoading(true)
        // try {
        //     const res = await axios.post(API_ADMIN_LOGIN, data)
        //     setLoading(false)

        //     if (res?.data?.code === CODE_ERROR_EMAIL_PASSWORD_NOT_CORRECT) {
        //         setIsInvalidEmailPassword(true)
        //     } else {
        //         if (res?.data?.status === 1) {
        //             localStorage.setItem('auth_token', res.data.data.token)
        //             localStorage.setItem('user_info', JSON.stringify(res.data.data))
        //             notification['success']({
        //                 message: t('common:msg_login_success', { name: res.data.data.name }),
        //             })
        //             if (res.data.data.rk_role_id === ROLE_HEAD_SHOP) {
        //                 const tenantId = getUserTenantId()
        //                 const mallId = getMallId()
        //                 history.push(bindParams(TENANT_DETAIL_PATH, { mall_id: mallId, tenant_id: tenantId }))
        //             } else if (res.data?.data?.rk_role_id === ROLE_PARKING_ADMIN) {
        //                 history.push(SEARCH_PARKING_PATH)
        //             } else {
        //                 history.push(CUSTOMER_PATH)
        //             }
        //         } else {
        //             notification['error']({
        //                 message: res?.data?.message,
        //             })
        //         }
        //     }
        // } catch (err) {
        //     // setLoading(false)
        //     // console.log(err)
        //     // if (err.response.data.code === CODE_ERROR_EMAIL_PASSWORD_NOT_CORRECT) {
        //     //     setIsInvalidEmailPassword(true)
        //     // }
        // }
    }

    return (
        <Layout.Content className={'login-wrapper login'}>
            <Row>
                <Col xs={0} sm={0} md={0} lg={12} xl={12}>
                    {/* <img src={bg} className="login--bg" alt={'login-bg'} /> */}
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <div className="login__form">
                        <Space direction="vertical" size={'large'}>
                            <div className="text-align-left">
                                <IconLogo />
                            </div>
                            <div className="login__form--title-welcome">{t('welcome_back')}</div>
                            <div className="login__form--title">{t('login_title')}</div>
                            <Form layout={'vertical'} onFinish={onFinish} onValuesChange={onValuesChange}>
                                <Form.Item
                                    label={t('email/username')}
                                    name={'email'}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('msg_required'),
                                        },
                                    ]}
                                >
                                    <Input
                                        className={'input-common'}
                                        size={'large'}
                                        placeholder={t('common:placeholder_email')}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label={t('password')}
                                    name={'password'}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('msg_required_password'),
                                        },
                                    ]}
                                >
                                    <Input
                                        type={'password'}
                                        className={'input-common'}
                                        size={'large'}
                                        placeholder={t('common:placeholder_password')}
                                    />
                                </Form.Item>
                                {isInvalidEmailPassword && (
                                    <div className="text-center">
                                        <Typography.Text type={'danger'}>
                                            {t('msg_invalid_email_password')}
                                        </Typography.Text>
                                    </div>
                                )}
                                <Space direction="vertical" size={'large'} className={'w-100'}>
                                    <div className="login__form--forgot-password">
                                        <NavLink to={""}>{t('forgot_password')}</NavLink>
                                    </div>
                                    <Button
                                        size={'large'}
                                        block
                                        htmlType={'submit'}
                                        className={'btn btn-common'}
                                        loading={loading}
                                        disabled={isInvalidEmailPassword}
                                    >
                                        {t('btn_login')}
                                    </Button>
                                </Space>
                            </Form>
                        </Space>
                    </div>
                </Col>
            </Row>
        </Layout.Content>
    )
}

export default Login
