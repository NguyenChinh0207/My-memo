import React from 'react'
import { Upload, notification, Form, Button } from 'antd'
import { useTranslation } from 'react-i18next'

const UploadFormItem = (props) => {
    const { t } = useTranslation('earningrule')

    const { children, className, onRemove, uploadState, setUploadState, limit, accept, acceptFileType, formItemProps, onUpload } = props

    const dummyRequest = ({ file, onSuccess }) => {
        onSuccess('ok')
        
        if (onUpload) onUpload()
    }

    const openNotification = (message, type = 'info') => {
        notification[type]({
            message: message,
            duration: 2,
        })
    }

    const beforeUpload = (file) => {
        const isCSV = acceptFileType === 'Excel only'
            ? false
            : (
                file.type === 'text/csv' ||
                file.type === 'application/vnd.ms-excel' ||
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
        const isXLSX =
            file.type === 'application/vnd.ms-excel' ||   // .xls
            file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'   // .xlsx

        if (acceptFileType === 'Excel only') {
            if (!isXLSX) {
                openNotification(`${file.name} ${t(`không phải định dạng xls hoặc xlsx`)}`, 'error')
            }
        }
        else if (!isCSV) {
            openNotification(`${file.name} ${t(`không phải định dạng csv, xls hoặc xlsx!`)}`, 'error')
        }

        const isLt25M = file.size / 1024 / 1024 < 5
        if (!isLt25M) {
            openNotification(t('Vui lòng tải file có dung lượng nhỏ hơn 5MB!'), t('error'))
        }

        return (isCSV || (acceptFileType === 'Excel only' && isXLSX)) && isLt25M ? true : Upload.LIST_IGNORE
    }

    const handleChange = ({ fileList }) => {
      if (fileList?.length > limit) {
          return
      }

      setUploadState({
          ...uploadState, fileList
      })
  }

    return (
        <>
            <Form.Item {...formItemProps}>
                <Upload
                    name="files"
                    // multiple
                    className={className}
                    customRequest={dummyRequest}
                    action=""
                    maxCount={1}
                    listType="text"
                    accept={accept}
                    fileList={uploadState.fileList}
                    onChange={handleChange}
                    onRemove={onRemove}
                    beforeUpload={beforeUpload}
                    
                >
                    {children ?? (
                        <Button className="Earning-rule-create-post_list" type="primary">
                            {t('upload_csv')}
                        </Button>
                    )}
                </Upload>
            </Form.Item>
        </>
    )
}
UploadFormItem.defaultProps = {
    className: 'upload-main-image',
}

export default UploadFormItem
