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
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
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
      floor
      building {
        id
        name
      }
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
  const [modalConfig, setModalConfig] = useState({
    open: false,
  });
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
      setModalConfig((prevConfig) => ({ ...prevConfig, open: true }));
    }
  };

  console.log({ vacantRooms });

  const handleMeetingDataInput = (data, key) => {
    setMeetingRoomSpecs((prevSpecs) => ({
      ...prevSpecs,
      [key]: data,
    }));
  };

  const bookMeetingRoom = () => {
    // Make the API call with this id
    if (modalConfig?.selectedCardId) {
      const meetingRoomDataPayload = vacantRooms.find(
        (item) => item.id === modalConfig?.selectedCardId
      );
      console.log(meetingRoomDataPayload);
    }
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
      {modalConfig.open && (
        <Modal
          open={modalConfig.open}
          onClose={() =>
            setModalConfig((prevConfig) => ({ ...prevConfig, open: false }))
          }
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Fade in={modalConfig.open}>
            <div className="modalWrapper">
              <h2>Please select one of the free rooms</h2>
              {vacantRooms &&
                vacantRooms?.length &&
                vacantRooms.map(({ name, building, floor, id }) => (
                  <div
                    className="roomDetailsWrapper"
                    onClick={() =>
                      setModalConfig((prevConfig) => ({
                        ...prevConfig,
                        selectedCardId: id,
                      }))
                    }
                  >
                    <h3>{name}</h3>
                    <p>{building?.name}</p>
                    <p>{`Floor: ${floor}`}</p>
                  </div>
                ))}
              <button onClick={bookMeetingRoom}>Save</button>
            </div>
          </Fade>
        </Modal>
      )}
    </div>
  );
};
export default AddMeeting;
