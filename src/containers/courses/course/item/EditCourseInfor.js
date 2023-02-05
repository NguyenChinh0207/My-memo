import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../CourseDetail.scss";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  notification,
  Select,
} from "antd";
import { AppContext } from "../../../../context/AppContext";
import { useHistory } from "react-router-dom";
import logoCourses from "../../../../assets/img/logoCourses.png";
import { UploadOutlined } from "@ant-design/icons";
import { API_COURSE_EDIT } from "../../../../config/endpointApi";
import { COURSE_DETAIL_PATH } from "../../../../config/path";
import { postAxios } from "../../../../Http";
import { bindParams, optionLanguages, optionVoices } from "../../../../config/function";

const EditCourseInfor = (props) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const { user_info } = useContext(AppContext);
  const { TextArea } = Input;
  const [value, setValue] = useState(false);
  const [image, setImage] = useState("");
  const course = props.course;
  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
    },
  };

  useEffect(() => {
    if (course) {
      if (course.active === 1) {
        setValue(true);
      } else {
        setValue(false);
      }
      form.setFieldsValue(course);
    }
    return () => {
      setValue(false);
    };
  }, [form, course]);

  const uploadFile = (e) => {
    console.log("in", e.target.files[0]);
    setImage(e.target.files[0].name);
  };

  const onFinish = async (data) => {
    setLoading(true);
    if (value) {
      data.active = 1;
    } else {
      data.active = 0;
    }
    data.id = course?._id;
    data.image = image;
    postAxios(API_COURSE_EDIT, data)
      .then((res) => {
        notification.success({
          message: t("Chỉnh sửa khóa học thành công."),
        });
        history.push(bindParams(COURSE_DETAIL_PATH, { courseId: res?.id }));
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("Đã có lỗi xảy ra")}: ${response?.data?.message}`
            : t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  return (
    <div className="formEditInfor">
      <Form
        className="wrapCourseCreate"
        name="basic"
        onFinish={onFinish}
        {...formItemLayout}
        form={form}
      >
        <Form.Item
          label={t("Tên khóa học")}
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: t("Đây là thông tin bắt buộc."),
            },
          ]}
          extra={t(
            "Đặt tên phù hợp cho khóa học sẽ giúp các học viên khác tìm kiếm dễ dàng hơn."
          )}
        >
          <Input placeholder={t("Nhập tên khóa học...")} />
        </Form.Item>
        <Form.Item
          label={t("Dạy")}
          name="language"
          rules={[
            {
              required: true,
              message: t("Đây là thông tin bắt buộc."),
            },
          ]}
        >
          <Select
            showSearch
            placeholder={t("Chọn ngôn ngữ")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionLanguages}
          />
        </Form.Item>
        <Form.Item
          label={t("Cho người nói")}
          name="my_language"
          rules={[
            {
              required: true,
              message: t("Đây là thông tin bắt buộc."),
            },
          ]}
        >
          <Select
            showSearch
            placeholder={t("Chọn ngôn ngữ")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionLanguages}
          />
        </Form.Item>
        <Form.Item label={t("Thanh âm")} name="voice">
          <Select
            showSearch
            placeholder={t("Chọn thanh âm")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionVoices}
          />
        </Form.Item>
        <Form.Item
          label={t("Mô tả")}
          name="description"
          rules={[
            {
              required: true,
              whitespace: true,
              message: t("Đây là thông tin bắt buộc."),
            },
          ]}
          extra={t("Mô tả khóa học bằng ngôn ngữ của người học.")}
        >
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item
          name="active"
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 18, offset: 6 },
          }}
        >
          <Checkbox
            defaultChecked={false}
            checked={value}
            onChange={() => setValue(!value)}
          >
            {t("Công khai")}
          </Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 18, offset: 6 },
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            className="createCourse"
            loading={loading}
          >
            {t("Chỉnh sửa khóa học")}
          </Button>
        </Form.Item>
      </Form>
      <div className="imgWrapper">
        <Image className="imgCourseEdit" alt="example" src={logoCourses} />
        <Button style={{ marginTop: "15px" }}>
          <label htmlFor="upload-photo-course" className="label-upload">
            <UploadOutlined size={24} style={{ marginRight: "3px" }} />
            {t("Tải ảnh lên")}
          </label>
        </Button>
      </div>
      <input
        type="file"
        name="image"
        id="upload-photo-course"
        onChange={uploadFile}
        style={{ display: "none" }}
        accept="image/*"
      />
    </div>
  );
};

export default React.memo(EditCourseInfor);
