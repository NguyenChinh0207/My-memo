import React, { useState } from "react";
import PropTypes from "prop-types";
import "./EditingNavBar.scss";
import { useTranslation } from "react-i18next";
import { Button, Tabs } from "antd";
const { TabPane } = Tabs;

const EditingNavBar = (props) => {
  const { t } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const { setTab } = props;

  const data = [{ title: "Từ" }, { title: "Chi tiết" }];

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const extraContent = (
    <Button onClick={props.goBack} className="BackBtn">
      <span className="LeftArrow" />
      {t("back_to_course")}
    </Button>
  );

  return (
    <div className="EditingNavBar">
      <div className="Row">
        <div style={{ width: "100%" }}>
          <div className="Title">{t("editing")}</div>
          <Tabs
            defaultActiveKey="0"
            tabBarExtraContent={extraContent}
            onChange={handleTabChange}
          >
            {data.map((item, index) => (
              <TabPane tab={item.title} key={index}></TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default React.memo(EditingNavBar);

EditingNavBar.propTypes = {
  goBack: PropTypes.func.isRequired,
};
