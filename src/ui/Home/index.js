import React from "react";
import "./index.scss";
import { Text } from "../components/index";
import { useNavigate } from "react-router-dom";
import { useQuery } from "graphql-hooks";

const HOMEPAGE_QUERY = `query HomePage {
  Buildings {
    name
  }
}`;

const Home = (props) => {
  let navigate = useNavigate();
  const { loading, error, data } = useQuery(HOMEPAGE_QUERY);
  if (data) console.log(data.Buildings.length, "data");
  return (
    <div className="home-container">
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
        <Text font="12px">Total : {data?.Buildings?.length}</Text>
      </div>
      <div className="content-div ">
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
            navigate("/add-meeting");
          }}
        >
          Add a meeting
        </button>
      </div>
    </div>
  );
};
export default Home;
