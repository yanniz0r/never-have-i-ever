import React, { FC, useLayoutEffect, useState } from "react";

const SlideView: FC = (props) => {
  const [isVisible, setVisible] = useState(false);
  useLayoutEffect(() => {
    setVisible(true);
  }, []);
  return <div className={`transition transform ${isVisible ? 'translate-x-0' : 'translate-full'}`}>
    {props.children}
  </div>
}

export default SlideView;
