import { useTranslation } from 'react-i18next';
import { Image } from 'antd';
import moment from 'moment';
import { FULL_PATH_FILE } from '../config/const';

const useColumns = (type = 'lecture', additionalColumns = []) => {
  const { t } = useTranslation("course");  

  const lectureColumns = [
    {
      title: "#",
      dataIndex: "key",
      width: "10%",
      render: (value, data, index) => {
        return index + 1;
      },
    },
    {
      title: t("image"),
      dataIndex: "image",
      render: (image) => {
        return <Image src={image ? `${FULL_PATH_FILE}/${image}` : null} style={{ width: "60px", height: "60px" }} />;
      },
    },
    {
      title: t("lecture_name"),
      dataIndex: "name",
      render: (name) => {
        return name;
      },
    },
    {
      title: t("description"),
      dataIndex: "description",
      ellipsis: true,
      render: (description) => {
        return description;
      },
    },
    {
      title: t("created_time"),
      dataIndex: "createdAt",
      render: (createdAt) => {
        return createdAt ? moment(createdAt).format("YYYY-MM-DD") : "";
      },
    },
  ];

  let columns = [];
  switch (type) {
    case 'lecture':
      columns = lectureColumns;
      break;
  }

  return [
    ...columns,
    ...additionalColumns,
  ];
};

export default useColumns;
