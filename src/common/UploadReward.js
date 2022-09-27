import React from 'react'
import { Upload, Modal, notification } from 'antd'
import PropTypes from 'prop-types'
import {IconPlus} from "../common/Icon/Icon";
import { useTranslation } from 'react-i18next'

const UploadReward = (props) => {
    const {t} = useTranslation("common")
    const {
        uploadTitle,
        className,
        onRemove,
        uploadState,
        setUploadState,
        uploadImage,
        previewImage,
        cancelImage,
        limit,
        accept,
        index
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

    const handleCancel = (file) => {
        cancelImage(file, index)
    }

    const handlePreview = async (file) => {
        previewImage(file, index)
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
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
            openNotification(
                'Vui lòng tải ảnh có dung lượng nhỏ hơn 1MB!',
                'error'
            )
        }

        return isJpgOrPng && isLt1M ? true : Upload.LIST_IGNORE
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
        <div style={{width: '100%'}}>
            <Upload
                multiple
                className={className}
                customRequest={dummyRequest}
                action=""
                listType="picture-card"
                accept={accept}
                fileList={ uploadState.fileList}
                onPreview={handlePreview}
                onChange={ (fileList) => {
                    if (fileList.fileList.length > limit) {
                        return
                    }
                    if (fileList.file && fileList.file.originFileObj) {
                        fileList.file.thumbUrl = URL.createObjectURL(fileList.file.originFileObj)
                        getBase64(fileList.file.originFileObj).then(function (result){
                            fileList.file.preview = result
                        })
                    }
                    // if (fileList.file.status === 'uploading') {
                    //     console.log('ahihi')
                    //     return
                    // }
                    uploadImage(fileList.fileList, index)
                }}
                onRemove={onRemove}
                beforeUpload={beforeUpload}
            >
                {uploadState.fileList.length >= limit ? null : uploadButton}
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
UploadReward.defaultProps = {
    className: "upload-main-image"
}

UploadReward.propTypes = {
    uploadTitle: PropTypes.string,
    className: PropTypes.string,
    onRemove: PropTypes.func,
    uploadState: PropTypes.shape({
        fileList: PropTypes.array,
        previewVisible: PropTypes.bool,
        previewImage: PropTypes.string,
        previewTitle: PropTypes.string,
    }).isRequired,
    setUploadState: PropTypes.func,
    uploadImage: PropTypes.func,
    previewImage: PropTypes.func,
    cancelImage: PropTypes.func,
    limit: PropTypes.number,
    accept: PropTypes.string,
    index: PropTypes.number,
}

export default React.memo(UploadReward)
