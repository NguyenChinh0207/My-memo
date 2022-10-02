import React from "react";
import Profile from "./Profile";
import './LeftColumn.scss'

const LeftColumn = (props) => (
  <div className={"LeftColumn"}>
    <Profile {...props.profile} />
  </div>
);

export default LeftColumn;
