import React from 'react'
import emptyIcon from '../assets/img/empty.png'
import { useTranslation } from 'react-i18next'

function Empty(props) {
    const { t } = useTranslation('common')

    return (
        <div style={{ marginTop: '20px' }}>
            <p style={{ fontSize: '18px' }}>{t('empty_data')}</p>
            <img alt="empty" src={emptyIcon} style={{ width: '200px' }}></img>
        </div>
    )
}

export default Empty
