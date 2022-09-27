import { Button, Form, Input, Modal } from 'antd'
import { useTranslation } from 'react-i18next'

const EnterMailExportCommon = ({ isExport, visible = false, onFinish, handleCancel }) => {
    const { t } = useTranslation('member')

    const onFinishForm = (values) => {
        const data = {
            email: values?.email,
        }
        onFinish(data)
    }
    return (
        <>
            <Modal
                forceRender
                footer={null}
                closable={false}
                visible={visible}
                onCancel={handleCancel}
                centered
                zIndex={10000}
            >
                <p className="header-title">{t('Xuất ra XLSX')}</p>
                <Form layout="vertical" onFinish={onFinishForm}>
                    <Form.Item
                        label={t('Địa chỉ Email')}
                        name="email"
                        validateTrigger="onBlur"
                        rules={[
                            {
                                required: true,
                                message: t('email_validate_required'),
                            },
                            { type: 'email', message: t('email_validate_type') },
                            {
                                max: 200,
                                message: t('email_validate_max_lenght'),
                            },
                        ]}
                    >
                        <Input size="large" maxLength={201} placeholder={t('Nhập địa chỉ email')} />
                    </Form.Item>
                    <div className="btn-endpage-layout">
                        <Button className="btn btn-common" size={'large'} htmlType="submit" loading={isExport}>
                            {t('Gửi')}
                        </Button>
                        <Button className="btn btn-cancel" size={'large'} onClick={handleCancel}>
                            {t('common:btn_cancel')}
                        </Button>
                    </div>
                </Form>
            </Modal>
        </>
    )
}
export default EnterMailExportCommon
