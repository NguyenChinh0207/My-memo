import React from 'react';
import PrivateLayout from "../../layout/PrivateLayout";
import {Button, Result} from "antd";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Unauthorized = () => {
  const history = useHistory();

  const { t } = useTranslation("common");
  return (
    // <PrivateLayout>
      <Result
        status="403"
        title="403"
        subTitle={t("unauthorized")}
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
    // </PrivateLayout>
  );
};

export default Unauthorized;