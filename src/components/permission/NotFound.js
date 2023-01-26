import React from 'react';
import {Button, Result} from "antd";
import PrivateLayout from "../../layout/PrivateLayout";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = ({ isPublicRoute }) => {
  const history = useHistory();
  const { t } = useTranslation("common");

  if (isPublicRoute) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => history.goBack()}
            className={"btn btn-common"}
            size={"large"}
          >
            {t("back")}
          </Button>
        }
        style={{ margin: "20vh 15vw 0" }}
      />
    );
  }

  return (
    <PrivateLayout>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button
            onClick={() => history.goBack()}
            className={"btn btn-common"}
            size={"large"}
          >
            {t("back")}
          </Button>
        }
      />
    </PrivateLayout>
  );
};

export default NotFound;