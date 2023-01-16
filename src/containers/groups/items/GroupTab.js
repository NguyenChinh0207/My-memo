import React, { useState } from "react";
import PropTypes from "prop-types";
import "../GroupList.scss";
import { useTranslation } from "react-i18next";
import { Button, Tabs } from "antd";
const { TabPane } = Tabs;

const GroupTab = (props) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const { setTab } = props;

  const data = [{ title: "Khóa học" }, { title: "Thành viên(0)" }];

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  return (
      <Tabs defaultActiveKey="0" onChange={handleTabChange}>
        {data.map((item, index) => (
          <TabPane tab={item.title} key={index}></TabPane>
        ))}
      </Tabs>
  );
};

export default React.memo(GroupTab);
