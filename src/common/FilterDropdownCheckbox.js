import React, { useState } from 'react'
import { Checkbox, Input, Row } from 'antd'
import { useTranslation } from 'react-i18next'
import FilterDropdown from './FilterDropdown'
import List from 'rc-virtual-list'

import './FilterDropdownCheckbox.scss'

const CheckboxGroup = Checkbox.Group

export function compare(a, b) {
    const labelA = a.label.toUpperCase()
    const labelB = b.label.toUpperCase()
    const comparison = labelA.localeCompare(labelB)
    return comparison
}
const FilterDropdownCheckbox = ({
    buttonText,
    onChange,
    options = [],
    className,
    virtual = false,
    value = [],
    isSearch = false,
}) => {
    const { t } = useTranslation('common')

    const [visible, setVisible] = useState(false)
    const [checkedList, setCheckedList] = useState(Array.isArray(value) ? value : [])
    const [indeterminate, setIndeterminate] = useState(true)
    const [checkAll, setCheckAll] = useState(false)
    const [searchText, setSearchText] = useState('')
    let searchOption = []

    if (options) {
        searchOption = [...options]
    }

    if (isSearch && searchText) {
        searchOption = options?.filter((v) => {
            return v?.label?.toLowerCase()?.includes(searchText?.toLowerCase())
        })
    }

    if (Array.isArray(value) && value.sort().join(',') !== checkedList.sort().join(',')) {
        setCheckedList(value)
    }

    const onCheckboxChange = (e) => {
        const optionValue = Number(e.target.value)
        const optionIndex = checkedList.indexOf(optionValue)
        const newValue = [...checkedList]
        if (optionIndex === -1) {
            newValue.push(optionValue)
        } else {
            newValue.splice(optionIndex, 1)
        }
        setCheckedList(newValue)
        setIndeterminate(!!newValue.length && newValue.length < searchOption.length)
        setCheckAll(newValue.length === searchOption.length)
        onChange(newValue)
    }

    const onCheckAllChange = (e) => {
        const list = e.target.checked ? searchOption.map((item) => item?.value) : []
        setCheckedList(list)
        setIndeterminate(false)
        setCheckAll(e.target.checked)
        onChange(list)
    }

    const onGroupChange = (list) => {
        setCheckedList(list)
        setIndeterminate(!!list.length && list.length < searchOption.length)
        setCheckAll(list.length === searchOption.length)
        onChange(list)
    }

    const filterButton = (
        <span>
            {buttonText}
            {!!checkedList.length && <span>({checkedList.length})</span>}
        </span>
    )

    const handleMenuClick = (e) => {}

    const handleVisibleChange = (flag) => {
        setVisible(flag)
    }

    const handleSearch = (val) => {
        setCheckAll(false)
        setSearchText(val?.target?.value)
    }

    const menuSelect = (
        <div className="DropdownCheckbox" onClick={handleMenuClick}>
            {isSearch ? (
                <div className="option-row">
                    <Input value={searchText} autoFocus placeholder={'Search'} onChange={handleSearch} />
                </div>
            ) : null}
            <div className="option-row">
                <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                    {t('Tất cả')}
                </Checkbox>
            </div>
            {virtual ? (
                <List
                    data={searchOption}
                    height={searchOption && searchOption?.length > 6 ? 260 : 0}
                    itemHeight={47}
                    itemKey="value"
                >
                    {(item) => (
                        <div className="option-row" key={item?.value}>
                            <Row span={24}>
                                <Checkbox
                                    onChange={onCheckboxChange}
                                    checked={checkedList.indexOf(item?.value) !== -1}
                                    value={item?.value}
                                >
                                    {item?.label}
                                </Checkbox>
                            </Row>
                        </div>
                    )}
                </List>
            ) : (
                <CheckboxGroup
                    options={searchOption}
                    value={checkedList}
                    onChange={onGroupChange}
                    className="list-dropdown-common"
                >
                    <Row>
                        {searchOption?.map((item) => (
                            <div className="option-row" key={item?.value}>
                                <Row span={24}>
                                    <Checkbox value={item?.value}>{item?.label}</Checkbox>
                                </Row>
                            </div>
                        ))}
                    </Row>
                </CheckboxGroup>
            )}
        </div>
    )

    return (
        <FilterDropdown
            size="large"
            trigger={['click']}
            menu={menuSelect}
            buttonText={filterButton}
            className={`FilterDropdownCheckbox ${className}`}
            onVisibleChange={handleVisibleChange}
            visible={visible}
        />
    )
}

export default FilterDropdownCheckbox
