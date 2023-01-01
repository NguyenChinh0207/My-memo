import React, { useEffect, useState } from "react";
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
  Input,
  List,
  notification,
  Row,
  Spin,
} from "antd";
import { bindParams } from "../../config/function";
import { SearchOutlined } from "@ant-design/icons";
import FormItem from "antd/es/form/FormItem";

const Courses = () => {
  const { t } = useTranslation("common");
  const history = useHistory();
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
        <Layout style={{ minWidth: "100vh" }}>
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
                        >
                          <Card
                            loading={loading}
                            hoverable
                            cover={
                              <img
                                className="imgCourse"
                                alt="example"
                                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
                              />
                            }
                          >
                            <Meta
                              title={item.name}
                              description={item.description}
                            />
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
