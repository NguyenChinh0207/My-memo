import React, { useState } from 'react'
import bg from '../../assets/img/auth/login_bg.png'
import { Button, Col, Form, Input, Layout, notification, Space } from 'antd'
import Row from 'antd/es/grid/row'
import './Login.scss'
import { IconLogo } from '../../common/Icon/Icon'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { ADMIN_LOGIN } from '../../config/path'
import axios from 'axios'
import { API_FORGOT_PASSWORD } from '../../config/endpointApi'
import { CODE_EMAIL_NOT_FOUND } from '../../config/const'

const ForgotPassword = () => {
    const { t } = useTranslation('forgotPassword')

    const [loading, setLoading] = useState(false)

    const [isInvalidEmail, setIsInvalidEmail] = useState(false)

    const [success, setSuccess] = useState(false)

    const onValuesChange = () => {
        if (isInvalidEmail) {
            setIsInvalidEmail(false)
        }
    }

    const onFinish = async (data) => {
        setLoading(true)
        try {
            await axios.post(API_FORGOT_PASSWORD, data)
            setLoading(false)
            setSuccess(true)
        } catch (err) {
            setLoading(false)
            if (err.response.data.code === CODE_EMAIL_NOT_FOUND) {
                setIsInvalidEmail(true)
                notification['error']({
                    message: t('common:email_not_exist'),
                })
            }
        }
    }

    const sendMailSuccess = () => {
        if (!success)
            return (
                <div className="login__form">
                    <Space direction="vertical" size={'large'} className={'w-100'}>
                        <div className="text-align-center">
                            <IconLogo />
                        </div>
                        <div className="login__form--title">{t('title_forgot')}</div>
                        <div className="login__form--title-welcome">{t('title_email')}</div>
                        <Form layout={'vertical'} onFinish={onFinish} onValuesChange={onValuesChange}>
                            <Space direction={'vertical'} className={'w-100'} size={'large'}>
                                <Form.Item
                                    label={t('Email')}
                                    name={'email'}
                                    rules={[
                                        {
                                            required: true,
                                            message: t('login:msg_required_email'),
                                        },
                                        {
                                            type: 'email',
                                            message: t('login:msg_invalid_email'),
                                        },
                                    ]}
                                >
                                    <Input className={'input-common'} size={'large'} />
                                </Form.Item>
                                <Space className={'w-100 button-row'} align={'center'}>
                                    <Button size={'large'} block className={'btn btn-default'}>
                                        <NavLink to={ADMIN_LOGIN}>{t('common:btn_back')}</NavLink>
                                    </Button>
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
                                </Space>
                            </Space>
                        </Form>
                    </Space>
                </div>
            )
        return (
            <div className="login__form">
                <Space direction="vertical" size={'large'} className={'w-100'}>
                    <div className="text-align-left">
                        <IconLogo />
                    </div>
                    <div className="login__form--title">{t('title_forgot')}</div>
                    <div className="login__form--title-welcome">{t('content')}</div>
                    <Button className={'btn btn-common'} size={'large'}>
                        <NavLink to={ADMIN_LOGIN}>{t('back_to_login')}</NavLink>
                    </Button>
                </Space>
            </div>
        )
    }

    return (
        <Layout.Content className={'login-wrapper login'}>
            <Row>
                <Col xs={0} sm={0} md={0} lg={12} xl={12}>
                    <img src={bg} className="login--bg" alt={'login-bg'} />
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    {sendMailSuccess()}
                </Col>
            </Row>
        </Layout.Content>
    )
}

export default ForgotPassword
