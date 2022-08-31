import React, { useState } from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import MomentUtils from "@date-io/moment";

import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { useQuery, useMutation } from "graphql-hooks";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import {
  ADD_MEETING,
  MEETING_QUERY,
  MEETING_ROOM_QUERY,
} from "../../utils/api/gql-queries/add-meeting-gql-query";
import { BUILDING_QUERY } from "../Home";



const AddMeeting = (props) => {
  const [AddMeeting] = useMutation(ADD_MEETING);
  const { data: MeetingsData } = useQuery(MEETING_QUERY);

  let getDefaultSpecs = () => ({
    selectedDate: {
      value: +new Date(),
      error: false,
    },
    startTime: {
      value: +new Date(),
      error: false,
    },
    endTime: {
      value: +new Date() + 30 * 60 * 1000,
      error: false,
    },
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
    let isValid = true;

    Object.entries(meetingRoomSpecs).forEach(([key, fieldData]) => {
      if (!fieldData?.value) {
        isValid = false;
        setMeetingRoomSpecs((prevSpecs) => ({
          ...prevSpecs,
          [key]: {
            value: prevSpecs[key].value,
            error: true,
          },
        }));
      }
    });
    if (!building?.value) isValid = false;

    return isValid;
  };

  const isMeetingClashing = (meeting, meetingRoomSpecs) => {
    const meetingDate = meeting?.date;

    /* As Date coming from API is in same format */
    const requiredDateEpoch = new Date(
      meetingRoomSpecs?.selectedDate?.value
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
      meetingDate === requiredDateEpoch &&
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
          }
          if (isMeetingRoomAvailable) {
            freeMeetingRooms.push(meetingRoom);
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

  const handleMeetingDataInput = (data, key) => {
    let updatedSpecs = { ...meetingRoomSpecs };
    switch (key) {
      case "endTime":
        updatedSpecs.endTime.value = data;
        updatedSpecs.endTime.error = data <= meetingRoomSpecs?.startTime?.value;
        updatedSpecs.startTime.error = data >= meetingRoomSpecs?.endTime?.value;
        break;

      case "startTime":
        updatedSpecs.startTime.value = data;
        updatedSpecs.endTime.error = data <= meetingRoomSpecs?.startTime?.value;
        updatedSpecs.startTime.error = data >= meetingRoomSpecs?.endTime?.value;
        break;

      default:
        updatedSpecs[key].value = data;
    }

    setMeetingRoomSpecs(updatedSpecs);
  };

  const bookMeetingRoom = () => {
    if (modalConfig?.selectedCardId) {
      const payload = {
        id: Number(MeetingsData?.Meetings?.length) + 1,
        title: meetingRoomSpecs?.title || "New Meeting",
        startTime: meetingRoomSpecs?.startTime?.value
          ? `${new Date(
              meetingRoomSpecs.startTime.value
            ).getHours()}:${new Date(
              meetingRoomSpecs.startTime.value
            ).getMinutes()}`
          : "",
        endTime: meetingRoomSpecs?.endTime.value
          ? `${new Date(meetingRoomSpecs.endTime.value).getHours()}:${new Date(
              meetingRoomSpecs.endTime.value
            ).getMinutes()}`
          : "",
        meetingRoomId: modalConfig?.selectedCardId,
        date: new Date(
          meetingRoomSpecs?.selectedDate?.value
        ).toLocaleDateString(),
      };
      AddMeeting({
        variables: payload,
      });
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
              disablePast={true}
              autoOk
              variant="inline"
              inputVariant="outlined"
              format="	
              DD/MM/YY"
              value={meetingRoomSpecs?.selectedDate?.value}
              error={meetingRoomSpecs?.selectedDate?.error}
              InputAdornmentProps={{ position: "start" }}
              onChange={(data) => handleMeetingDataInput(data, "selectedDate")}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              error={meetingRoomSpecs?.startTime?.error}
              value={meetingRoomSpecs?.startTime?.value}
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
              error={meetingRoomSpecs?.endTime?.error}
              value={meetingRoomSpecs?.endTime?.value}
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
        <button
          className={building ? "next-button" : "disabled-button"}
          onClick={submitMeetingDetails}
          type="button"
        >
          Next
        </button>
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
                    className={`roomDetailsWrapper ${
                      modalConfig?.selectedCardId === id ? "selected" : ""
                    }`}
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
