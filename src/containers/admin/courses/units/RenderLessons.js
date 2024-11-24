import {
  Button,
  Col,
  Form,
  Input,
  notification,
  Radio,
  Row,
  Space,
  Spin,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router-dom";
import "./Units.scss";
import "react-quill/dist/quill.snow.css";
import { QUILL_CONFIG } from "../../../../config/const";
import ReactQuill from "react-quill";
import {
  UploadOutlined,
  PlusSquareOutlined,
  MinusSquareOutlined,
} from "@ant-design/icons";
import uuid from "react-uuid";
import AdminLayout from "../../../../layout/AdminLayout";
import { useFileUpload } from "../../../../hook/useFileUpload";
import { useLessonAction } from "../../../../hook/useLessonAction";

const RenderLessons = () => {
  const { t } = useTranslation("course");
  const history = useHistory();
  const [type, setType] = useState(1);
  const [form] = Form.useForm();
  const location = useLocation();
  const { handleFileUpload } = useFileUpload();
  const { handleLessonAction } = useLessonAction();
  const { unitId, lessonId, courseId } = useParams();
  const [content, setContent] = useState("");
  const [newWord, setNewWord] = useState("");
  const [spelling, setSpelling] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [translateExample, setTranslateExample] = useState("");
  const [arrayNewWords, setArrayNewWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState();
  const [preview, setPreview] = useState();
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState();
  const [answer1, setAnswer1] = useState();
  const [answer2, setAnswer2] = useState();
  const [answer3, setAnswer3] = useState();
  const [answer4, setAnswer4] = useState();
  const [correct, setCorrect] = useState();

  const Label = (props) => (
    <span className="common-label--black">{props.children} :</span>
  );

  const Text = ({ pink, children, lightGray, ...restProps }) => {
    return (
      <span {...restProps} style={{ marginLeft: "10px" }}>
        {children}
      </span>
    );
  };

  useEffect(() => {
    if (video && typeof video === "string") {
      setPreview(video);
    }
 }, [video]);

  useEffect(() => {
    if (lessonId && location?.state?.detail) {
      const detail = location.state.detail;
      if (detail?.tagType) {
        setType(Number(detail.tagType));
      }
      if (detail?.newWords) {
        setArrayNewWords(detail.newWords);
      }
      if (detail?.questions) {
        setQuestions(detail.questions);
      }
      form.setFieldsValue({ ...detail, tagType: Number(detail?.tagType) });
    }
  }, [location, form]);

  const handleAddNewWord = () => {
    if (newWord.trim()) {
      let arr = [...arrayNewWords];
      const obj = {
        id: uuid(),
        newWord: newWord || "",
        spelling: spelling || "",
        meaning: meaning || "",
        example: example || "",
        translate_example: translateExample || "",
      };
      // arr.push(obj);
      setArrayNewWords((prev) => [...prev, obj]);
      form.setFieldsValue({
        newWord: "",
        spelling: "",
        meaning: "",
        example: "",
        translate_example: "",
      });
      setNewWord("");
      setMeaning("");
      setSpelling("");
      setExample("");
      setTranslateExample("");
    }
  };

  const handleRemoveNewWord = (id) => {
    let arr = [...arrayNewWords];
    arr = arr.filter((item) => item.id !== id);
    setArrayNewWords(arr);
  };

  const handleAddQuestion = () => {
    if (question && question.trim()) {
      let arr = [...questions];
      const obj = {
        id: uuid(),
        question: question || "",
        answer1: answer1 || "",
        answer2: answer2 || "",
        answer3: answer3 || "",
        answer4: answer4 || "",
        correct: correct || "",
      };
      // arr.push(obj);
      setQuestions((prev) => [...prev, obj]);
      form.setFieldsValue({
        question: "",
        answer1: "",
        answer2: "",
        answer3: "",
        answer4: "",
        correct: "",
      });
      setQuestion("");
      setAnswer1("");
      setAnswer2("");
      setAnswer3("");
      setAnswer4("");
      setCorrect("");
    }
  };

  const handleRemoveQuestion = (id) => {
    let arr = [...questions];
    arr = arr.filter((item) => item.id !== id);
    setQuestions(arr);
  };

  const uploadFile = async (e) => {
    const video_path = await handleFileUpload(e);
    setVideo(video_path);
  };


  const onFinish = async (body) => {
    body.id = lessonId;
    body.unitId = unitId;
    body.newWords = arrayNewWords;
    body.questions = questions;

    if (video && video.name) {
      body.video = video;
    }
    await handleLessonAction(lessonId, body, t, setLoading);
  };

  const handleChangeQuill = (html) => {
    setContent(html);
  };
  const renderForm = () => {
    if (loading) {
      return (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Spin size={"large"} />
        </div>
      );
    }

    return (
      <div className="site-layout-background">
        <Form
          className={"w-100 form-admin-course"}
          layout={"vertical"}
          form={form}
          initialValues={{ content: content, type: type || 1 }}
          onFinish={onFinish}
        >
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Form.Item
                label={t("lesson_name")}
                name="title"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("validate_required"),
                  },
                ]}
              >
                <Input placeholder={t("lesson_name_placeholder")} />
              </Form.Item>
              <Form.Item
                label={t("lesson_name_teaching")}
                name="titleTargetLanguage"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: t("validate_required"),
                  },
                ]}
              >
                <Input placeholder={t("lesson_name_placeholder")} />
              </Form.Item>
              <Form.Item label={t("video")} name="video">
                <Row>
                  <Col
                    span={24}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="imgWrapper">
                      {preview || location?.state?.detail?.video ? (
                        <video width="400" controls>
                          <source
                            src={preview || location?.state?.detail?.video}
                          />
                        </video>
                      ) : (
                        ""
                      )}
                      <Button style={{ marginTop: "15px" }}>
                        <label
                          htmlFor="upload-photo-course"
                          className="label-upload"
                        >
                          <UploadOutlined
                            size={24}
                            style={{ marginRight: "3px" }}
                          />
                          {t("upload_video")}
                        </label>
                      </Button>
                    </div>
                    <input
                      type="file"
                      name="video"
                      id="upload-photo-course"
                      onChange={uploadFile}
                      style={{ display: "none" }}
                      accept="video/*"
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Form.Item label={t("lesson_type")} name="tagType">
                <Radio.Group
                  name="radiogroup"
                  onChange={(e) => setType(e.target.value)}
                  value={type}
                >
                  <Radio value={1} name="vocab">
                    {t("vocabulary")}
                  </Radio>
                  <Radio value={2} name="grammar">
                    {t("grammar")}
                  </Radio>
                  <Radio value={3} name="listen">
                    {t("listen")}
                  </Radio>
                  <Radio value={4} name="read">
                    {t("read")}
                  </Radio>
                </Radio.Group>
              </Form.Item>
              {type === 1 && (
                <div>
                  <Row>
                    <Col span={5} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("Vocabulary")} name="newWord">
                        <Input
                          placeholder={t("vocab_placeholder")}
                          onChange={(e) => setNewWord(e.target.value)}
                          value={newWord}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("transcription")} name="spelling">
                        <Input
                          placeholder={t("transcription_placeholder")}
                          onChange={(e) => setSpelling(e.target.value)}
                          value={spelling}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label={t("mean")} name="meaning">
                        <Input
                          placeholder={t("mean_placeholder")}
                          onChange={(e) => setMeaning(e.target.value)}
                          value={meaning}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("example")} name="example">
                        <Input
                          placeholder={t("example_placeholder")}
                          onChange={(e) => setExample(e.target.value)}
                          value={example}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        label={t("example_translated")}
                        name="translate_example"
                      >
                        <Input
                          placeholder={t("example_placeholder")}
                          onChange={(e) => setTranslateExample(e.target.value)}
                          value={translateExample}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    onClick={handleAddNewWord}
                    style={{ marginBottom: "10px" }}
                  >
                    <PlusSquareOutlined
                      style={{ fontSize: "36px", color: "#898787" }}
                    />
                  </div>
                  {arrayNewWords.map((item) => (
                    <Row key={item.id}>
                      <Col span={5} style={{ marginRight: "20px" }}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("new_vocab")}</Label>
                          <Text>{item.newWord}</Text>
                        </div>
                      </Col>
                      <Col span={5} style={{ marginRight: "20px" }}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("transcription")}</Label>
                          <Text>{item.spelling}</Text>
                        </div>
                      </Col>
                      <Col span={5}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("mean")}</Label>
                          <Text>{item.meaning}</Text>
                        </div>
                      </Col>
                      <Col span={10} style={{ marginRight: "20px" }}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("example")}</Label>
                          <Text>{item.example}</Text>
                        </div>
                      </Col>
                      <Col span={10}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("translate")}</Label>
                          <Text>{item.translate_example}</Text>
                        </div>
                      </Col>
                      <Col span={2}>
                        <MinusSquareOutlined
                          style={{ fontSize: "36px", color: "#898787" }}
                          onClick={() => handleRemoveNewWord(item.id)}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}
              {(type === 3 || type === 4) && (
                <div>
                  <di>{t("create_test_question")}</di>
                  <Row>
                    <Col span={24}>
                      <Form.Item label={t("question")} name="question">
                        <Input
                          placeholder={t("question_placeholder")}
                          onChange={(e) => setQuestion(e.target.value)}
                          value={question}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("answer1")} name="answer1">
                        <Input
                          placeholder={t("answer_placeholder")}
                          onChange={(e) => setAnswer1(e.target.value)}
                          value={answer1}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("answer2")} name="answer2">
                        <Input
                          placeholder={t("answer_placeholder")}
                          onChange={(e) => setAnswer2(e.target.value)}
                          value={answer2}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5} style={{ marginRight: "20px" }}>
                      <Form.Item label={t("answer3")} name="answer3">
                        <Input
                          placeholder={t("answer_placeholder")}
                          onChange={(e) => setAnswer3(e.target.value)}
                          value={answer3}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label={t("answer4")} name="answer4">
                        <Input
                          placeholder={t("answer_placeholder")}
                          onChange={(e) => setAnswer4(e.target.value)}
                          value={answer4}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={5}>
                      <Form.Item label={t("correct_answer")} name="correct">
                        <Input
                          placeholder={t("answer_placeholder")}
                          onChange={(e) => setCorrect(e.target.value)}
                          value={correct}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <div
                    onClick={handleAddQuestion}
                    style={{ marginBottom: "10px" }}
                  >
                    <PlusSquareOutlined
                      style={{ fontSize: "36px", color: "#898787" }}
                    />
                  </div>
                  {questions.map((item) => (
                    <Row key={item.id}>
                      <Col span={24} style={{ marginRight: "20px" }}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("question")}</Label>
                          <Text>{item.question}</Text>
                        </div>
                      </Col>
                      <Col span={24} style={{ marginRight: "20px" }}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("answer")}</Label>
                          <Text>{`${item.answer1}, ${item.answer2}, ${item.answer3}, ${item.answer4}`}</Text>
                        </div>
                      </Col>
                      <Col span={22}>
                        <div style={{ display: "flex" }}>
                          <Label>{t("correct_answer")}</Label>
                          <Text>{item.correct}</Text>
                        </div>
                      </Col>
                      <Col span={2}>
                        <MinusSquareOutlined
                          style={{ fontSize: "36px", color: "#898787" }}
                          onClick={() => handleRemoveQuestion(item.id)}
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              )}

              <Form.Item label={t("content")} name="content" initialvalue={""}>
                <ReactQuill
                  className="news-content-editor"
                  name="editor"
                  modules={QUILL_CONFIG.modules}
                  formats={QUILL_CONFIG.formats}
                  onChange={handleChangeQuill}
                  value={content || ""}
                />
              </Form.Item>
            </Col>
            <Col
              span={24}
              className={"area-button"}
              style={{ marginTop: "20px" }}
            >
              <Space>
                <Button
                  size={"large"}
                  className={"btn btnBack"}
                  id="btn-solid"
                  onClick={() => history.goBack()}
                >
                  {t("back")}
                </Button>
                <Button
                  loading={loading}
                  htmlType={"submit"}
                  className={"btn btn-common"}
                  size={"large"}
                  block
                >
                  {!lessonId ? t("common:create") : t("common:edit")}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        t("created_courses"),
        `${courseId}`,
        t("lecture"),
        `${unitId}`,
        !lessonId ? t("common:create") : `${lessonId}`,
        lessonId && t("common:edit"),
      ]}
    >
      {renderForm()}
    </AdminLayout>
  );
};
export default RenderLessons;
