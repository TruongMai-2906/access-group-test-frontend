import axios from "axios";

const clientAxios = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    // "Access-Control-Request-Headers": "application/json",
  },
});

export default clientAxios;
