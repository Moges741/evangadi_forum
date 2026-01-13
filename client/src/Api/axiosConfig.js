import axios from "axios";

const axiosBase = axios.create({
  // baseURL: "http://localhost:5500/api",
  baseURL: "https://evangadiforum.be.birhann.com/api",
});

export default axiosBase;
