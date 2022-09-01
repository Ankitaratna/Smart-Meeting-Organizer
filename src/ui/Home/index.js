import React from "react";
import "./index.scss";
import { Text } from "../components/index";
import { useNavigate } from "react-router-dom";
import { useQuery } from "graphql-hooks";

 export const BUILDING_QUERY = `query Building {
  Buildings{
    name
    id
  }
}`;

 const MEETING_ROOM_QUERY = `query Room
{
  MeetingRooms{
    name
    }
}`;

 const MEETING_QUERY = `
query Meeting
{
  Meetings
  {
    title
    date
    startTime
    endTime
  }
}`;
const Home = (props) => {
  let navigate = useNavigate();

  const { data: buildingData } = useQuery(BUILDING_QUERY);
  const { data: RoomData } = useQuery(MEETING_ROOM_QUERY);
  const { data: MeetingsData } = useQuery(MEETING_QUERY);
  var today = new Date();
  console.log(MeetingsData, RoomData, "meetings");
  return (
    <div className="home-container">
      <div className="content-div ">
        <Text font="14px" weight="500">
          Buildings
        </Text>
        <Text font="12px">Total : {buildingData?.Buildings?.length}</Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Rooms
        </Text>
        <Text font="12px">Total : {RoomData?.MeetingRooms?.length}</Text>
      </div>
      <div className="content-div ">
        <Text font="14px" weight="500">
          Meetings
        </Text>
        <Text font="12px">Total : {MeetingsData?.Meetings?.length}</Text>
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
