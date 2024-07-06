import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage/Homepage";
import Detail from "./pages/detail/Detail";
import NewJob from "./pages/new-job/NewJob";
import { createContext, useEffect, useState } from "react";
import { Alert, AlertColor } from "@mui/material";

export const AppContext = createContext<{
  message?: MessageDataType;
  setMessage?: React.Dispatch<React.SetStateAction<MessageDataType>>;
}>({});

export interface MessageDataType {
  show: boolean;
  severity: AlertColor;
  message: string;
}

function App() {
  const [message, setMessage] = useState<MessageDataType>({
    show: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    if (message.show) {
      setTimeout(() => {
        setMessage({
          show: false,
          message: "",
          severity: "success",
        });
      }, 3000);
    }
  }, [message]);

  return (
    <div className="app">
      <AppContext.Provider value={{ message, setMessage }}>
        <div className={`alert ${message.show ? "alert--show" : ""}`}>
          <Alert variant="filled" severity={message.severity}>
            {message.message}
          </Alert>
        </div>
        <div>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<Navigate to="/jobs" replace />} />
                <Route path="/jobs" element={<Homepage />}></Route>
                <Route path="/jobs/:id/edit" element={<Detail />} />
                <Route path="/jobs/new" element={<NewJob />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
      </AppContext.Provider>
    </div>
  );
}

export default App;
