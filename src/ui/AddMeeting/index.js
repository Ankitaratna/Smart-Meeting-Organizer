import React, { useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import MomentUtils from "@date-io/moment";

import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useQuery } from "graphql-hooks";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { BUILDING_QUERY } from "../Home";

const MEETING_ROOM_QUERY = `query FetchRoom($id:Int!)
{
  Building(id:$id)
  {
     id
    name
   meetingRooms
    {
      name
      id
      meetings{
        startTime
        endTime
        date
      }
     
    }
   
  }
}`;

const AddMeeting = (props) => {
  let navigate = useNavigate();

  let getDefaultSpecs = () => ({
    selectedDate: +new Date(),
    startTime: new Date(),
    endTime: new Date(),
  });

  const [meetingRoomSpecs, setMeetingRoomSpecs] = useState(getDefaultSpecs());

  const [vacantRooms, setVacantRooms] = useState([]);
  const [building, setBuilding] = useState();

  const { data: buildingData } = useQuery(BUILDING_QUERY);
  const { data: meetingRoomData } = useQuery(MEETING_ROOM_QUERY, {
    variables: { id: building?.value },
  });

  const options = (list) => {
    let buildingOptions = list
      ? list.map((item) => ({ label: item.name, value: item.id }))
      : [];
    return buildingOptions;
  };

  const validateMeetingDetailsForm = () => {
    return true;
  };

  const isMeetingClashing = (meeting, meetingRoomSpecs) => {
    const meetingDateEpoch = meeting?.date;

    /* As Date coming from API is in same format */
    const requiredDateEpoch = new Date(
      meetingRoomSpecs?.selectedDate
    ).toLocaleDateString();

    let meetingStartTimeSeconds;
    let meetingEndTimeSeconds;

    if (meeting?.startTime) {
      const [hours, minutes] = meeting?.startTime.split(":");
      if (Number(hours) > 0) meetingStartTimeSeconds = hours * 60 * 60;

      if (Number(minutes) > 0) meetingStartTimeSeconds += minutes * 60;
    }
    if (meeting?.endTime) {
      const [hours, minutes] = meeting?.endTime.split(":");
      if (Number(hours) > 0) meetingEndTimeSeconds = hours * 60 * 60;

      if (Number(minutes) > 0) meetingEndTimeSeconds += minutes * 60;
    }

    const todaysEpoch = +new Date(`${new Date().toDateString()}`);

    const requiredStartTimeEpoch = Math.floor(
      (Number(+new Date(meetingRoomSpecs?.startTime)) - Number(todaysEpoch)) /
        1000
    );
    const requiredEndTimeEpoch = Math.floor(
      (Number(+new Date(meetingRoomSpecs?.endTime)) - Number(todaysEpoch)) /
        1000
    );

    return (
      meetingDateEpoch === requiredDateEpoch &&
      ((requiredStartTimeEpoch > meetingStartTimeSeconds &&
        requiredStartTimeEpoch < meetingEndTimeSeconds) ||
        (requiredEndTimeEpoch > meetingStartTimeSeconds &&
          requiredEndTimeEpoch < meetingEndTimeSeconds))
    );
  };

  const getAvailableRooms = () => {
    let freeMeetingRooms = [];

    if (meetingRoomData?.Building) {
      const { meetingRooms } = meetingRoomData?.Building ?? [];

      if (meetingRooms && meetingRooms?.length) {
        meetingRooms.forEach((meetingRoom) => {
          const { meetings } = meetingRoom;
          let isMeetingRoomAvailable = true;
          if (meetings && meetings?.length) {
            meetings.forEach((meeting) => {
              if (isMeetingClashing(meeting, meetingRoomSpecs)) {
                isMeetingRoomAvailable = false;
              }
            });
            if (isMeetingRoomAvailable) {
              freeMeetingRooms.push(meetingRoom);
            }
          }
        });
      }
    }
    return freeMeetingRooms;
  };

  const submitMeetingDetails = () => {
    if (validateMeetingDetailsForm()) {
      setVacantRooms(getAvailableRooms());
    }
  };

  console.log({ vacantRooms });

  const handleMeetingDataInput = (data, key) => {
    setMeetingRoomSpecs((prevSpecs) => ({
      ...prevSpecs,
      [key]: data,
    }));
  };

  return (
    <div className="add-meeting-container">
      <div className="field-wrapper">
        <div className="label-container">
          <div className="label">Date</div>
          <div className="label"> Start Time</div>
          <div className="label"> End Time</div>
          <div className="label"> Select Building</div>
        </div>
        <div className="input-fields">
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardDatePicker
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="	
              DD/MM/YY"
              value={meetingRoomSpecs?.selectedDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={(data) => handleMeetingDataInput(data, "selectedDate")}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              value={meetingRoomSpecs?.startTime}
              onChange={(data) => handleMeetingDataInput(data, "startTime")}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              value={meetingRoomSpecs?.endTime}
              onChange={(data) => handleMeetingDataInput(data, "endTime")}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>

          <Dropdown
            options={options(buildingData?.Buildings || [])}
            onChange={(option) => {
              setBuilding(option);
            }}
            placeholder="Select an option"
          />
        </div>
      </div>
      <div className="common btn">
        <button onClick={submitMeetingDetails}>Next</button>
      </div>
    </div>
  );
};
export default AddMeeting;
