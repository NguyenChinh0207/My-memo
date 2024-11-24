import React, { useState } from "react";
import PropTypes from "prop-types";
import "./TabsUnit.scss";
import { useTranslation } from "react-i18next";
import { Button, Tabs } from "antd";
const { TabPane } = Tabs;

const TabsUnit = (props) => {
  const { t } = useTranslation("course");
  const { setTab } = props;

  const data = [{ title: t("lecture") }];

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  return (
    <div className="">
      <div className="">
        <div style={{ width: "100%" }}>
          <Tabs defaultActiveKey="0" onChange={handleTabChange}>
            {data.map((item, index) => (
              <TabPane tab={item.title} key={index}></TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TabsUnit);

TabsUnit.propTypes = {
  goBack: PropTypes.func.isRequired,
};
