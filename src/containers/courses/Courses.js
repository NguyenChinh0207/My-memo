import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useHistory } from "react-router-dom";
import "./Courses.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import { COURSE_CREATE_PATH, COURSE_DETAIL_PATH } from "../../config/path";
import Layout from "antd/lib/layout/layout";
import { postAxios } from "../../Http";
import { API_COURSE_LIST } from "../../config/endpointApi";
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Image,
  Input,
  List,
  notification,
  Row,
  Spin,
} from "antd";
import { bindParams } from "../../config/function";
import { SearchOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";
import logoCourses from "../../assets/img/logoCourses.png";
import { AppContext } from "../../context/AppContext";

const Courses = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const { user_info } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [keyword, setKeyword] = useState("");
  const { Meta } = Card;
  const LIMIT = 28;

  useEffect(() => {
    loadCourses();
  }, [skip, keyword]);

  const loadCourses = () => {
    setLoading(true);
    postAxios(API_COURSE_LIST, { skip: skip, limit: LIMIT, keyword: keyword })
      .then((res) => {
        setTotal(res?.total);
        const arr = res?.data;
        setCourses((prev) => [...prev, ...arr]);
      })
      .catch((error) => {
        notification.error({
          message: t("Đã có lỗi xảy ra, vui lòng thử lại sau."),
        });
      })
      .then(() => setLoading(false));
  };

  const handleLoadMore = () => {
    setLoading(true);
    setSkip(skip + 1);
  };

  const onSearch = (data) => {
    setCourses([]);
    setKeyword(data.keyword);
    setSkip(0);
  };

  return (
    <PrivateLayout>
      {loading ? (
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
      ) : (
        <Layout style={{ minWidth: "100vh" }} className="Course">
          <div className="PageHead">
            <div className="PageHeadRow">
              <div className="Title">{t("Các khóa học")}</div>
              <div className="create-search">
                <Form
                  className="tabbar-form"
                  onFinish={onSearch}
                  initialValues={{ keyword: keyword }}
                >
                  <FormItem name={"keyword"}>
                    <Input placeholder={t("Nhập từ khóa...")} />
                  </FormItem>
                  <Button
                    loading={loading}
                    icon={<SearchOutlined />}
                    htmlType="submit"
                  />
                </Form>
                <NavLink className="CreateButton" to={COURSE_CREATE_PATH}>
                  {t("Tạo khóa học")}
                </NavLink>
              </div>
            </div>
          </div>
          <div className="Content-courses">
            <div>
              <Row>
                <Col span={24}>
                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 3,
                      md: 4,
                      lg: 4,
                      xl: 4,
                      xxl: 4,
                    }}
                    dataSource={courses}
                    renderItem={(item) => (
                      <List.Item key={item.id}>
                        <div
                          onClick={() =>
                            history.push(
                              bindParams(COURSE_DETAIL_PATH, {
                                courseId: item._id,
                              })
                            )
                          }
                          className="card-box"
                        >
                          <Card
                            loading={loading}
                            hoverable
                            cover={
                              <img
                                className="imgCourse"
                                alt="example"
                                src={logoCourses}
                              />
                            }
                          >
                            <div className="detail-wrapper">
                              <div className="author-box">
                                <a href="#" className="category">
                                  {item?.language}
                                </a>
                                <span className="author">
                                  {t("bởi")}{" "}
                                  <a
                                    href="#"
                                    data-role="hovercard"
                                    data-user-id="2224242"
                                    data-direction="bottom"
                                    className="author-link"
                                  >
                                    {item?.owner?.username}
                                  </a>
                                </span>
                              </div>
                              <h3 className="inner">{item?.name}</h3>
                            </div>
                          </Card>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </div>
            <div className="loadmore_wrap">
              {LIMIT <= courses.length / (skip + 1) && (
                <Button
                  onClick={handleLoadMore}
                  loading={loading}
                  className="btn-load"
                >
                  {t("Hiển thị thêm")}
                </Button>
              )}
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default Courses;
