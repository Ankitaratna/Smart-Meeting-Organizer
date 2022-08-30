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

const AddMeeting = (props) => {
  let navigate = useNavigate();
  const { data: buildingData } = useQuery(BUILDING_QUERY);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  // console.log(
  //   startTime.toLocaleString("en-US", { hour12: false }),
  //   "  ",
  //   endTime.toLocaleString("en-US", { hour12: false }),
  //   "st",
  //   "et"
  // );

  const options = (list) => {
    let buildingOptions = list ? list.map((item) => item.name) : [];
    console.log(buildingOptions, "bodyOptions");
    return buildingOptions;
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
              value={selectedDate}
              InputAdornmentProps={{ position: "start" }}
              onChange={(date) => setSelectedDate(date)}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="Start Time"
              value={startTime}
              onChange={(date) => setStartTime(date)}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker
              margin="normal"
              id="time-picker"
              label="End Time"
              value={endTime}
              onChange={(date) => setEndTime(date)}
              KeyboardButtonProps={{
                "aria-label": "change time",
              }}
            />
          </MuiPickersUtilsProvider>

          {/* <TextField id="outlined-basic" variant="outlined" /> */}
          {/* <TextField id="outlined-basic" varsiant="outlined" /> */}

          <Dropdown
            options={options(buildingData?.Buildings || [])}
            onChange={() => {}}
            placeholder="Select an option"
          />
        </div>
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
