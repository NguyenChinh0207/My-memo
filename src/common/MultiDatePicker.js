import React, { useState } from "react";
import { Tag, DatePicker, Select } from "antd";
import moment from "moment";
import "./MultiDatePicker.scss";
import { CalendarOutlined } from "@ant-design/icons";

function getTimestamp(value) {
  return value.startOf("day").format("YYYY-MM-DD");
}

export default function MultiDatePicker({
  value: selectedDate = [],
  onChange,
  format = "YYYY-MM-DD",
  selectProps = {},
  datePickerProps = {},
  timeBegin,
  timeEnd,
  placeholder
}) {

  const [open, setOpen] = useState(false);

  const onValueChange = (date) => {
    const t = getTimestamp(date);
    const index = selectedDate.indexOf(t);
    const clone = [...selectedDate];
    console.log(index)
    console.log(t)
    if (index > -1) {
      clone.splice(index, 1);
    }
    else {
      clone.push(t);
    }
    onChange && onChange(clone);
  };

  const dateRender = (currentDate) => {
    const isSelected = selectedDate.indexOf(getTimestamp(currentDate)) > -1;
    return (
      <div
        className={"ant-picker-cell-inner"}
        style={
          isSelected
            ? {
                position: "relative",
                zIndex: 2,
                display: "inlineBlock",
                width: "24px",
                height: "22px",
                lineHeight: "22px",
                backgroundColor: "#D13D9E",
                color: "#fff",
                margin: "auto",
                borderRadius: "2px",
                transition: "white 0.3s, border 0.3s"
              }
            : {
            }
        }
      >
        {currentDate.date()}
      </div>
    );
  };

  const renderTag = ({ value, onClose }) => {
    const handleClose = () => {
      onClose();
      onChange && onChange(selectedDate.filter((t) => t !== value));
    };
    return (
      <Tag onClose={handleClose} closable>
        {moment(value).format(format)}
      </Tag>
    );
  };

  return (
    <Select
      allowClear
      {...selectProps}
      mode="multiple"
      placeholder={placeholder}
      value={selectedDate}
      onClear={() => onChange && onChange([])}
      tagRender={renderTag}
      open={open}
      showArrow={true}
      suffixIcon={<CalendarOutlined />}
      className="Multi-date-picker"
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      dropdownMatchSelectWidth={false}
      size="large"
      dropdownClassName={"multipleDropdownClassName"}
      dropdownStyle={{ height: "270px", width: "280px", minWidth: "0" }}
      dropdownRender={() => {
        return (
          <DatePicker
            {...datePickerProps}
            className="Multi-date-picker"
            format={"YYYY-MM-DD"}
            onChange={onValueChange}
            showToday={false}
            open
            dateRender={dateRender}
            style={{ ...datePickerProps.style, visibility: "hidden" }}
            getPopupContainer={() =>
              document.getElementsByClassName("multipleDropdownClassName")[0]
            }
            disabledDate={(value) => {

              if (!timeEnd || !timeBegin) {
                return true
              }

              return !value || value.startOf('day').isAfter(moment(timeEnd)) || value.startOf('day').isBefore( moment(timeBegin))}}
          />
        );
      }}
    />
  );
}
