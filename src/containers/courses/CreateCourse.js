import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./Courses.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import Layout from "antd/lib/layout/layout";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
} from "antd";
import { AppContext } from "../../context/AppContext";
import { optionLanguages, optionVoices } from "../../config/function";
import { useCourseAction } from "../../hook/useCourseAction";

const CreateCourse = () => {
  const { t } = useTranslation("course");
  const [loading, setLoading] = useState(false);
  const { user_info } = useContext(AppContext);
  const { TextArea } = Input;
  const [value, setValue] = useState(false);
  const { handleCourseAction} = useCourseAction();

  useEffect(() => {
    return () => {
      setValue(false);
      setLoading(false);
    };
  }, []);

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

  const onFinish = async (data) => {
    data.owner = user_info?._id;
    // data.image =
    //   "https://memo-files.s3.us-west-2.amazonaws.com/logoCourses.png";
    if (value) {
      data.active = 1;
    } else {
      data.active = 0;
    }
    await handleCourseAction("", data, t, setLoading);
  };

  return (
    <PrivateLayout>
      <Layout style={{ minWidth: "100vh" }} className="Course">
        <div className="PageHead">
          <div className="PageHeadRow">
            <div className="Title">{t("create_course")}</div>
          </div>
        </div>
        <Form
          className="wrapCourseCreate"
          name="basic"
          onFinish={onFinish}
          {...formItemLayout}
        >
          <Form.Item
            label={t("course_name")}
            name="name"
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("validate_required"),
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
                message: t("validate_required"),
              },
            ]}
          >
            <Select
              showSearch
              placeholder={t("select_lang")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
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
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={optionLanguages}
            />
          </Form.Item>
          <Form.Item label={t("voice_lang")} name="voice">
            <Select
              showSearch
              placeholder={t("select_voice")}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
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
              {t("create_course")}
            </Button>
          </Form.Item>
        </Form>
      </Layout>
    </PrivateLayout>
  );
};

export default CreateCourse;
