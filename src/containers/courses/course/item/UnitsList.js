import { Card, Col, List, notification, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { API_UNIT_LIST_BY_COURSE } from "../../../../config/endpointApi";
import { bindParams } from "../../../../config/function";
import { UNIT_DETAIL_PATH } from "../../../../config/path";
import { postAxios } from "../../../../Http";
import "../CourseDetail.scss";
import logoUnits from "../../../../assets/img/unit.jpg";

export const UnitsList = (items) => {
  const { t } = useTranslation("common");
  const history = useHistory();
  const [loading, setLoading] = useState();
  const [units, setUnits] = useState([]);

  useEffect(() => {
    if (items?.course?._id) loadUnits();
  }, [items]);

  const loadUnits = () => {
    setLoading(true);
    postAxios(API_UNIT_LIST_BY_COURSE, { courseId: items?.course?._id })
      .then((res) => {
        const list = res?.data;
        setUnits(list);
      })
      .catch((error) => {
        const { response } = error;
        notification.error({
          message: response?.data?.message
            ? `${t("common:server_error")}: ${response?.data?.message}`
            : t("common:msg_please_try_again"),
        });
      })
      .finally(() => setLoading(false));
  };
  return (
    <>
      <div className="Content-courses">
        <div>
          <Row>
            <Col span={24}>
              <List
                grid={{
                  gutter: 16,
                  xs: 1,
                  sm: 3,
                  md: 3,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                dataSource={units}
                renderItem={(item) => (
                  <List.Item key={item._id}>
                    <div
                      onClick={() =>
                        history.push({
                          pathname: `${bindParams(UNIT_DETAIL_PATH, {
                            unitId: item._id,
                          })}`,
                          state: { detail: item },
                        })
                      }
                      className="card-box"
                    >
                      <Card
                        loading={loading}
                        hoverable
                        cover={
                          <img
                            className="imgCourse"
                            src={item?.image ? item.image : logoUnits}
                          />
                        }
                      >
                        <div className="detail-wrapper">
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
      </div>
    </>
  );
};
