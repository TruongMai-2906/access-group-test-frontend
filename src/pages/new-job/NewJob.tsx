import { useContext, useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AppContext } from "../../App";
import api from "../../api/api";
import { JobDataType } from "../../types/jobTypes";
import styles from "./NewJob.module.scss";

const NewJob = () => {
  const { setMessage } = useContext(AppContext);
  const [localData, setLocalData] = useState<JobDataType>();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const responseData = await api.post(`/jobs`, JSON.stringify(localData));

    if (responseData?.data.state) {
      setMessage &&
        setMessage({
          message: "Create job successfully!",
          severity: "success",
          show: true,
        });
      navigate("/jobs");
    } else {
      setMessage &&
        setMessage({
          message: "Create job failed!",
          severity: "error",
          show: true,
        });
    }
  };

  return (
    <div className={styles["root"]}>
      <div className={styles["section-title"]}>Create new job</div>
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
                  label="Expired Date"
                  defaultValue={dayjs(Date.now().toLocaleString())}
                  value={dayjs(localData?.expired_date || "")}
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
          <Button variant="contained" onClick={() => handleCreate()}>
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewJob;
