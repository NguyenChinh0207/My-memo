import React, { useContext, useEffect, useState } from "react";
import "../CourseDetail.scss";
import { useTranslation } from "react-i18next";
// import AWS from "aws-sdk";
import {
  Button,
  Checkbox,
  Form,
  Image,
  Input,
  Select,
} from "antd";
import logoCourses from "../../../../assets/img/logoCourses.png";
import { UploadOutlined } from "@ant-design/icons";
import { optionLanguages, optionVoices } from "../../../../config/function";
import { useFileUpload } from "../../../../hook/useFileUpload";
import { useCourseAction } from "../../../../hook/useCourseAction";

const EditCourseInfor = (props) => {
  const { t } = useTranslation("course");
  const [loading, setLoading] = useState(false);
  const { handleFileUpload } = useFileUpload();
  const { handleCourseAction } = useCourseAction();
  const { TextArea } = Input;
  const [value, setValue] = useState(false);
  const [image, setImage] = useState("");
  const course = props.course;
  const [form] = Form.useForm();
  const [preview, setPreview] = useState();

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
    if (image && typeof image === "string") {
      setPreview(image);
    }
  }, [image]);

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

  const uploadFile = async (e) => {
    const image_path = await handleFileUpload(e);
    setImage(image_path);
  };

  const onFinish = async (body) => {
    if (value) {
      body.active = 1;
    } else {
      body.active = 0;
    }
    body.id = course?._id;
    if (image && image.name) {
      body.image = image;
    }
    await handleCourseAction(body.id, body, t, setLoading);
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
          label={t("course_name")}
          name="name"
          rules={[
            {
              required: true,
              whitespace: true,
              message: t("common:validate_required"),
            },
          ]}
          extra={t("give_course_name")}
        >
          <Input placeholder={t("course_name_placeholder")} />
        </Form.Item>
        <Form.Item
          label={t("teacher_lang")}
          name="language"
          rules={[
            {
              required: true,
              message: t("common:validate_required"),
            },
          ]}
        >
          <Select
            showSearch
            placeholder={t("select_lang")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionLanguages}
          />
        </Form.Item>
        <Form.Item
          label={t("learner_lang")}
          name="my_language"
          rules={[
            {
              required: true,
              message: t("validate_required"),
            },
          ]}
        >
          <Select
            showSearch
            placeholder={t("select_lang")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionLanguages}
          />
        </Form.Item>
        <Form.Item label={t("voice_lang")} name="voice">
          <Select
            showSearch
            placeholder={t("select_voice")}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={optionVoices}
          />
        </Form.Item>
        <Form.Item
          label={t("description")}
          name="description"
          rules={[
            {
              required: true,
              whitespace: true,
              message: t("validate_required"),
            },
          ]}
          extra={t("description_course")}
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
            {t("active")}
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
            {t("edit_course")}
          </Button>
        </Form.Item>
      </Form>
      <div className="imgWrapper">
        <Image
          className="imgCourseEdit"
          src={preview || course?.image || logoCourses}
        />
        <Button style={{ marginTop: "15px" }}>
          <label htmlFor="upload-photo-course" className="label-upload">
            <UploadOutlined size={24} style={{ marginRight: "3px" }} />
            {t("upload_image")}
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
