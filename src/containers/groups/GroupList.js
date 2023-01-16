import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useHistory } from "react-router-dom";
import "./GroupList.scss";
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
import GroupTab from "./items/GroupTab";

const GroupList = () => {
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
  const [tab, setTab] = useState("0");

  const groups = [
    {
      _id: 1,
      name: "ABC",
      type: 0,
      member: ["Anh"],
      courses: ["43545454544", "45454343"],
      owner: "",
    },
  ];
  const CoursesGroup = () => (
    <div className="GroupCourses">toi la a</div>
  );
  const MembersGroup = () => (
    <div className="GroupMembers">toi la member</div>
  );

  const ContentList = () => {
    return (
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        loading={loading}
        dataSource={groups}
        renderItem={(item) => (
          <List.Item key={item?._id} className="listItemOwner">
            <div className="groupsList">
              <div className="tilteCourseOwner">
                <img
                  className="imgCourseOwner"
                  alt="example"
                  src={logoCourses}
                />
                <div className="groupsTitleTab">
                  <div className="titleItem">
                    <h3 className="courseNameOwner">{item?.name}</h3>
                    <p>
                      {t("Người tạo nhóm")}
                      <span style={{ color: "#15a1ec" }}> ChinhNT</span>{" "}
                    </p>
                  </div>
                  <div style={{ marginLeft: "18px" }}>
                    <GroupTab setTab={setTab} />
                  </div>
                  {tab === "0" && <CoursesGroup />}
                </div>
              </div>
              <div className={"MoreOptionsDiv InviteBtn"}>
                <Button> {t("Mời")}</Button>
              </div>
            </div>
          </List.Item>
        )}
        className="ownerList"
      />
    );
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
        <Layout style={{ minWidth: "100vh" }} className="Groups">
          <div className="PageHead">
            <div className="PageHeadRow">
              <div className="Title">{t("Nhóm đã tạo")}</div>
              <div className="create-search">
                <NavLink className="CreateButton" to={COURSE_CREATE_PATH}>
                  {t("Tạo nhóm mới")}
                </NavLink>
              </div>
            </div>
          </div>
          <div className="Content-courses Content-courses-owner">
            <div>
              <Row>
                <Col span={24}>
                  <ContentList />
                </Col>
              </Row>
            </div>
          </div>
        </Layout>
      )}
    </PrivateLayout>
  );
};

export default GroupList;
