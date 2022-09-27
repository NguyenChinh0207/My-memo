import React from 'react'
import { Upload, Modal, notification } from 'antd'
import PropTypes from 'prop-types'
import {IconPlus} from "../common/Icon/Icon";
import { useTranslation } from 'react-i18next'

const UploadCommon = (props) => {
	const {t} = useTranslation("common")
    const {
        uploadTitle,
        className,
        onRemove,
        uploadState,
        setUploadState,
        limit,
        accept,
        isLandingPage
    } = props

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = (error) => reject(error)
        })
    }

    const handleCancel = () => {
        setUploadState({ ...uploadState, previewVisible: false })
    }

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        setUploadState({
            ...uploadState,
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        })
    }

    const dummyRequest = ({ onSuccess }) => {
        onSuccess('ok')
    }

    const openNotification = (message, type = 'info') => {
        notification[type]({
            message: message,
            duration: 2,
        })
    }

    const beforeUpload = (file) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' ||
            file.type === 'image/png' ||
            file.type === 'image/jpg'
        if (!isJpgOrPng) {
            openNotification(
                `${file.name} không phải định dạng jpeg, jpg hoặc png!`,
                'error'
            )
        }

        const isLt2M = file.size / 4096 / 4096 < 1
        if (!isLt2M) {

            openNotification(
                'Vui lòng tải ảnh có dung lượng nhỏ hơn 4MB!',
                'error'
            )
        }
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
            openNotification(
                'Vui lòng tải ảnh có dung lượng nhỏ hơn 1MB!',
                'error'
            )
        }

        return isJpgOrPng && (isLandingPage? isLt2M : isLt1M)? true : Upload.LIST_IGNORE
    }

    const uploadButton = (
        <div className="uploader">
            <div className="justify-content-center text-center">
                <div className="font-2xl">
                    <IconPlus/>
                </div>
                <div className="upload-title mt-3">
                    {' '}
                    {uploadTitle || t('common:add_image')} 
                </div>
            </div>
        </div>
    )

    return (
        <div>
            <Upload
                multiple
                className={className}
                customRequest={dummyRequest}
                action=""
                listType="picture-card"
                accept={accept}
                fileList={uploadState?.fileList}
                onPreview={handlePreview}
                onChange={(fileList) => {
                    if (fileList?.fileList?.length > limit) {
                        return
                    }
					if (fileList?.file && fileList?.file?.originFileObj) {
                        fileList.file.thumbUrl = URL.createObjectURL(fileList?.file?.originFileObj)
                    }
                    // if (fileList.file.status === 'uploading') {
                    //     console.log('ahihi')
                    //     return
                    // }

                    setUploadState({
                        ...uploadState,
                        fileList: fileList?.fileList,
                    })
                }}
                onRemove={onRemove}
                beforeUpload={beforeUpload}
            >
                {uploadState?.fileList?.length >= limit ? null : uploadButton}
            </Upload>
            <Modal
                visible={uploadState.previewVisible}
                title={uploadState.previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={uploadState.previewImage}
                />
            </Modal>
        </div>
    )
}
UploadCommon.defaultProps = {
    className: "upload-main-image"
}

UploadCommon.propTypes = {
    uploadTitle: PropTypes.object,
    className: PropTypes.string,
    onRemove: PropTypes.func,
    uploadState: PropTypes.shape({
        fileList: PropTypes.array,
        previewVisible: PropTypes.bool,
        previewImage: PropTypes.string,
        previewTitle: PropTypes.string,
    }).isRequired,
    setUploadState: PropTypes.func,
    limit: PropTypes.number,
    accept: PropTypes.string,
}

export default React.memo(UploadCommon)
