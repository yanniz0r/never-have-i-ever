import React, { FC, useEffect, useState } from "react";

const SlideView: FC = (props) => {
  const [isVisible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);
  return <div className={`transition transform ${isVisible ? 'translate-x-0' : 'translate-full'}`}>
    {props.children}
  </div>
}

export default SlideView;
