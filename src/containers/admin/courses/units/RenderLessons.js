import { Button, Col, Form, Input, Radio, Row } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import "./Units.scss";
import "react-quill/dist/quill.snow.css";
import { QUILL_CONFIG } from "../../../../config/const";
import ReactQuill from "react-quill";

export const RenderLessons = (items) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [type, setType] = useState(1);
  const [form] = Form.useForm();

  const handleChangeQuill = (_html, _a, _b, e) => {
    if (e.getText().trim().length === 0) {
      form.setFieldsValue({
        content: null,
      });
    }
  };

  return (
    <div>
      <Form
        className={"w-100 form-admin-course"}
        layout={"vertical"}
        form={form}
      >
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Form.Item
              label={t("Tên bài giảng")}
              name="name"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input placeholder={t("Nhập tên bài giảng...")} />
            </Form.Item>
            <Form.Item
              label={t("Tên bài giảng")}
              name="titleTargetLanguage"
              extra={t("Hãy viết tên bài giảng bằng ngôn ngữ dạy.")}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: t("Đây là thông tin bắt buộc."),
                },
              ]}
            >
              <Input placeholder={t("Nhập tên bài giảng...")} />
            </Form.Item>
            <Form.Item label={t("Loại bài giảng")} name="type">
              <Radio.Group
                name="radiogroup"
                defaultValue={1}
                onChange={(e) => setType(e.target.value)}
              >
                <Radio value={1}>{t("Từ vựng")}</Radio>
                <Radio value={2}>{t("Ngữ pháp")}</Radio>
              </Radio.Group>
            </Form.Item>
            {type === 1 && (
              <Row>
                <Col span={5} style={{ marginRight: "20px" }}>
                  <Form.Item
                    label={t("Từ vựng")}
                    name="word"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: t("Đây là thông tin bắt buộc."),
                      },
                    ]}
                  >
                    <Input placeholder={t("Nhập từ vựng...")} />
                  </Form.Item>
                </Col>
                <Col span={5} style={{ marginRight: "20px" }}>
                  <Form.Item label={t("Phiên âm")} name="announ">
                    <Input placeholder={t("Nhập phiên âm...")} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item label={t("Ý nghĩa")} name="mean">
                    <Input placeholder={t("Nhập từ vựng...")} />
                  </Form.Item>
                </Col>
                <Col span={10} style={{ marginRight: "20px" }}>
                  <Form.Item label={t("Ví dụ")} name="example">
                    <Input placeholder={t("Ví dụ...")} />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Form.Item label={t("Ví dụ-dịch")} name="example">
                    <Input placeholder={t("Dịch...")} />
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Form.Item label={t("Nội dung")} name="content">
              <ReactQuill
                className="news-content-editor"
                name="editor"
                modules={QUILL_CONFIG.modules}
                formats={QUILL_CONFIG.formats}
                onChange={handleChangeQuill}
                value=""
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
