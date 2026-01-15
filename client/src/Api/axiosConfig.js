import axios from "axios";

const axiosBase = axios.create({
  // baseURL: "http://localhost:5500/api",
  baseURL: "https://evangadiforum.be.birhann.com/api",
  // baseURL: "https://evangadi-forum-1-edti.onrender.com/api",
});

export default axiosBase;
