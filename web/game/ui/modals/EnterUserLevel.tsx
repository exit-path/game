import React from "react";
import { observer } from "mobx-react-lite";

interface Props {
  className?: string;
}

export const EnterUserLevel = observer<Props>(function EnterUserLevel(props) {
  return <div className={props.className}></div>;
});
