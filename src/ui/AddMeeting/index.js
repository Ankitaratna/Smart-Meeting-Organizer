import React from "react";
import "./index.scss";
import { Text } from "../components/index";
import { useNavigate } from "react-router-dom";

const AddMeeting = (props) => {
  let navigate = useNavigate();
  return (
    <div className="home-container">
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
      </div>
      <div className="common btn">
        <button
          onClick={() => {
            // history.push("/add-meeting");
          }}
        >
          Add a meeting
        </button>
      </div>
      {/* <div className="content-div ">
        <Text font="14px" weight="500">
          Rooms
        </Text>
        <Text font="12px">Total :</Text>
        <Text font="12px">Free Now:</Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Meetings
        </Text>
        <Text font="12px">Total :</Text>
        <Text font="12px">Free Now:</Text>
      </div>
      <div className="common btn">
        <button
          onClick={() => {
            history.push("/add-meeting");
          }}
        >
          Add a meeting
        </button>
      </div> */}
    </div>
  );
};
export default AddMeeting;
