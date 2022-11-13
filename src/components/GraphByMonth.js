import React, { useState, useEffect } from "react";
import { Line } from "@ant-design/plots";
import styled from "styled-components";
import { Spin } from "antd";
import axios from "axios";
import { DatePicker } from "antd";
import moment from "moment";

const StyledContainer = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  margin-top: 5%;
  justify-content: center;
`;

const StyledGraphContainer = styled.div`
  margin-left: 15%;
  margin-right: 15%;
  margin-top: 5%;
`;

const StyledDateContainer = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  margin-bottom: 2%;
  justify-content: flex-start;
`;

const options = {
  method: "GET",
  url: "https://apistocks.p.rapidapi.com/monthly",
  params: { symbol: "META", dateStart: "2022-01-01", dateEnd: "2022-10-30" },
  headers: {
    "X-RapidAPI-Key": "24ccf2f227mshd1d2fae9e703dd2p19ae15jsnb2e169493364",
    "X-RapidAPI-Host": "apistocks.p.rapidapi.com",
  },
};

const GraphByMonth = () => {
  const [data, setData] = useState([]);
  const [spinner, setSpinner] = useState(false);
  const [state, setState] = useState([]);
  const { RangePicker } = DatePicker;

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  useEffect(() => {
    setSpinner(true);
    asyncFetch();
  }, [startDate]);

  if (spinner) {
    return (
      <StyledContainer>
        <StyledGraphContainer>
          <Spin />
        </StyledGraphContainer>
      </StyledContainer>
    );
  }

  const asyncFetch = () => {
    axios
      .request(options)
      .then((response) => setData(response.data.Results))
      .catch((error) => {
        console.log("fetch data failed", error);
      })
      .finally(() => {
        setSpinner(false);
      });
  };
  const config = {
    data,
    padding: "auto",
    xField: "Date",
    yField: "High",
    xAxis: {
      type: "time",
    },
  };

  function onDateSelection(fromDate, toDate) {
    console.log("from", fromDate, "to", toDate);

    setStartDate((options.params.dateStart = toDate[0]));
    setEndDate((options.params.dateEnd = toDate[1]));

    console.log("getSingedate", toDate[0]);
  }

  return (
    <>
      <StyledDateContainer>
        <RangePicker
          format="YYYY-MM-DD"
          picker="month"
          onChange={onDateSelection}
        />
      </StyledDateContainer>

      <Line {...config} />
    </>
  );
};

export default GraphByMonth;
