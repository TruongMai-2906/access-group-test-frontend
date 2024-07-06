import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../App";
import api from "../../api/api";
import { JobDataType } from "../../types/jobTypes";
import styles from "./Detail.module.scss";

import dayjs from "dayjs";
import { Button, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setMessage } = useContext(AppContext);

  const [localData, setLocalData] = useState<JobDataType>();

  const fetchJobDetail = async () => {
    const responseData = await api.get(`/jobs/${id}`);

    if (responseData?.data.data) {
      setLocalData(responseData?.data.data);
    }

    return responseData?.data;
  };

  const handleUpdate = async (id: string) => {
    const responseData = await api.put(
      `/jobs/${id}`,
      JSON.stringify(localData)
    );

    if (responseData?.data.state) {
      setMessage &&
        setMessage({
          message: "Update job successfully!",
          severity: "success",
          show: true,
        });
      fetchJobDetail();
    } else {
      setMessage &&
        setMessage({
          message: "Update job failed!",
          severity: "error",
          show: true,
        });
    }
  };

  useEffect(() => {
    fetchJobDetail();
  }, []);

  return (
    <div className={styles["root"]}>
      <div className={styles["section-title"]}>Job Detail - {id}</div>
      <div className={styles["content-container"]}>
        <div className={styles["input-group"]}>
          <div className={styles["label"]}>Title</div>
          <TextField
            className={styles["input"]}
            id="title"
            variant="outlined"
            value={localData?.title}
            onChange={(e) => {
              setLocalData({
                ...localData,
                title: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles["input-group"]}>
          <div className={styles["label"]}>Description</div>
          <TextField
            className={styles["input"]}
            id="description"
            multiline
            rows={4}
            value={localData?.description}
            onChange={(e) => {
              setLocalData({
                ...localData,
                description: e.target.value,
              });
            }}
          />
        </div>
        <div className={styles["input-group"]}>
          <div className={styles["label"]}>Expried Date</div>
          <div className={styles["input"]}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Basic date picker"
                  value={dayjs(localData?.expired_date)}
                  onChange={(e) => {
                    setLocalData({
                      ...localData,
                      expired_date: e?.toISOString(),
                    });
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div className={styles["button-group"]}>
          <Button variant="outlined" onClick={() => navigate("/jobs")}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => id && handleUpdate(id)}>
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Detail;
