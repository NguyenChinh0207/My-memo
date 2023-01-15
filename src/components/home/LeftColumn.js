import React from "react";
import Profile from "./Profile";
import './LeftColumn.scss'

const LeftColumn = (props) => (
  <div className={"LeftColumnProfile"}>
    <Profile {...props.profile} />
  </div>
);

export default LeftColumn;
