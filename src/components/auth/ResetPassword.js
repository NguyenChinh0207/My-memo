import React, { useState } from 'react'
// import bg from '../../assets/img/auth/login_bg.png'
import { Button, Col, Form, Input, Layout, notification, Space } from 'antd'
import Row from 'antd/es/grid/row'
import './Login.scss'
import { IconLogo } from '../../common/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import { ADMIN_LOGIN } from '../../config/path'
// import { API_RESET_PASSWORD } from '../../config/endpointApi'
import queryString from 'query-string'

const ResetPassword = () => {
    const { t } = useTranslation('resetPassword')

    const location = useLocation()

    const history = useHistory()

    const [loading, setLoading] = useState(false)

    const [isInvalidEmail, setIsInvalidEmail] = useState(false)

    const params = queryString.parse(location.search)

    if (!params.token) history.push(ADMIN_LOGIN)

    const onFinish = async (data) => {
        // setLoading(true)
        // try {
        //     await axios.post(API_RESET_PASSWORD, { ...data, token: params.token })
        //     setLoading(false)
        //     notification['success']({
        //         message: t('common:msg_change_password_success'),
        //     })
        //     history.push(ADMIN_LOGIN)
        // } catch (err) {
        //     setLoading(false)
        //     if (err.response.data.code === CODE_CONFIRM_TOKEN_NOT_FOUND) {
        //         setIsInvalidEmail(true)
        //         notification['error']({
        //             message: t('common:email_not_exist'),
        //         })
        //     }
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
                        <Space direction="vertical" size={'large'} className={'w-100'}>
                            <div className="text-align-center">
                                <IconLogo />
                            </div>
                            <div className="login__form--title">{t('title_new_password')}</div>
                            <div className="login__form--title-welcome">{t('title_make_new_password')}</div>
                            <Form layout={'vertical'} onFinish={onFinish}>
                                <Form.Item
                                    label={t('new_password')}
                                    name={'password'}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('login:msg_required_password'),
                                        },
                                        {
                                            min: 8,
                                            message: t('msg_min_password'),
                                        },
                                    ]}
                                >
                                    <Input className={'input-common'} size={'large'} type={'password'} />
                                </Form.Item>
                                <Form.Item
                                    label={t('confirm_password')}
                                    name={'confirm_password'}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('msg_confirm_password_required'),
                                        },
                                        {
                                            min: 8,
                                            message: t('msg_min_password'),
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve()
                                                }
                                                return Promise.reject(new Error(t('msg_password_does_not_match')))
                                            },
                                        }),
                                    ]}
                                >
                                    <Input className={'input-common'} size={'large'} type={'password'} />
                                </Form.Item>
                                <Button
                                    size={'large'}
                                    block
                                    htmlType={'submit'}
                                    className={'btn btn-common'}
                                    loading={loading}
                                    disabled={isInvalidEmail}
                                >
                                    {t('common:btn_continue')}
                                </Button>
                            </Form>
                        </Space>
                    </div>
                </Col>
            </Row>
        </Layout.Content>
    )
}

export default ResetPassword
