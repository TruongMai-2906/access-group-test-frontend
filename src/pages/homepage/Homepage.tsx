import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { formatDate } from "../../utils/utils";
import { JobDataType } from "../../types/jobTypes";
import styles from "./Homepage.module.scss";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { AppContext } from "../../App";

const Homepage = () => {
  const { setMessage } = useContext(AppContext);
  const navigate = useNavigate();

  const [jobList, setJobList] = useState<JobDataType[]>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [openPopup, setOpenPopup] = useState<{ id: number; state: boolean }>({
    id: -1,
    state: false,
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  const columns: GridColDef[] = [
    { field: "job_id", headerName: "ID", width: 70 },
    { field: "title", headerName: "Title", width: 200 },
    { field: "description", headerName: "Description", width: 300 },
    {
      field: "expired_date",
      headerName: "Expried Date",
      width: 250,
      valueGetter: (_, row) => {
        const dateString = row.expired_date;
        const date = new Date(dateString);

        const formatedDate = formatDate(date);

        return formatedDate;
      },
    },
    {
      field: "created_at",
      headerName: "Created At",
      width: 250,
      valueGetter: (_, row) => {
        const dateString = row.created_at;
        const date = new Date(dateString);

        const formatedDate = formatDate(date);

        return formatedDate;
      },
    },
    {
      field: "updated_at",
      headerName: "Updated At",
      width: 250,
      valueGetter: (_, row) => {
        const dateString = row.updated_at;
        const date = new Date(dateString);

        const formatedDate = formatDate(date);

        return formatedDate;
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => {
        const data: JobDataType = params.row;

        return (
          <div className={styles["buttons-group"]}>
            <Tooltip title="Edit">
              <div
                className={styles["button"]}
                onClick={() => navigate(`/jobs/${data.job_id}/edit`)}
              >
                <EditIcon />
              </div>
            </Tooltip>
            <Tooltip title="Delete">
              <div
                className={styles["button"]}
                onClick={() => handleClickOpen(data?.job_id || -1)}
              >
                <DeleteIcon />
              </div>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const fetchAllJobs = async (pagination: {
    page: number;
    pageSize: number;
  }) => {
    const { page, pageSize } = pagination;
    const responseData = await api.get(
      `/jobs?page_number=${page}&page_size=${pageSize}`
    );

    if (responseData?.data && responseData?.data.row_count > 0) {
      //set total row
      setRowCount(Number(responseData?.data.data[0].full_count));
      setJobList(responseData?.data.data);
    }

    return responseData?.data;
  };

  const handleDelete = async (id: number) => {
    const responseData = await api.del(`/jobs/${id}`);

    if (responseData?.data.state) {
      fetchAllJobs(paginationModel);
      setMessage &&
        setMessage({
          message: "Delete job successfully!",
          severity: "success",
          show: true,
        });

      setOpenPopup({
        id: -1,
        state: false,
      });
    } else {
      setMessage &&
        setMessage({
          message: "Delete job failed!",
          severity: "error",
          show: true,
        });

      setOpenPopup({
        id: -1,
        state: false,
      });
    }
  };

  const handleClickOpen = (id: number) => {
    setOpenPopup({
      id: id,
      state: true,
    });
  };

  const handleClose = () => {
    setOpenPopup({
      id: -1,
      state: false,
    });
  };

  useEffect(() => {
    fetchAllJobs(paginationModel);
  }, [paginationModel]);

  return (
    <div className={styles["root"]}>
      <div className={styles["section-title"]}>Job List</div>

      <div className={styles["content-container"]}>
        <Button variant="contained" onClick={() => navigate("/jobs/new")}>
          Create new job
        </Button>
        <div className={styles["table"]}>
          {jobList && (
            <DataGrid
              rows={jobList}
              columns={columns}
              rowCount={rowCount || 0}
              initialState={{
                pagination: {
                  paginationModel: paginationModel,
                },
              }}
              pageSizeOptions={[5]}
              paginationModel={paginationModel}
              paginationMode="server"
              onPaginationModelChange={setPaginationModel}
            />
          )}
        </div>
      </div>

      <Dialog
        open={openPopup.state}
        onClose={() => handleClose()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure to delete Job {openPopup.id}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you delete it, data will not be reverted!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button onClick={() => handleDelete(openPopup.id)} autoFocus>
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Homepage;
