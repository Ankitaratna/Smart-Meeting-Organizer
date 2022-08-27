import React, { Fragment } from "react"; // So it doesn't create a unnecessary node element. **Only available in react 16+

export const Text = (props) => (
  <div
    style={{
      fontSize: props.font,
      fontWeight: props.weight,
      color: props.color,
    }}
  >
    {props.children}
  </div>
);
