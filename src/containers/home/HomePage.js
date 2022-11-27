import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import LeftColumn from "../../components/home/LeftColumn";
import "./HomePage.scss";
import PrivateLayout from "../../layout/PrivateLayout";
import { Layout } from "antd";
import Welcome from '../../components/home/Welcome';

const HomePage = () => {
  const { t } = useTranslation("common");

  const history = useHistory();

  return (
    <PrivateLayout>
      <Layout>
        <div className={"Content"}>
          <div className={"ContainerMain"}>
            <LeftColumn profile={""} />
            <div className={"RightColumn"}>
              <Welcome />
            </div>
          </div>
        </div>
      </Layout>
    </PrivateLayout>
  );
};

export default HomePage;
