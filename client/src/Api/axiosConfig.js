//

import axios from "axios";

const axiosBase = axios.create({
  // Replace with your actual Render or local backend URL
  baseURL: "http://localhost:5500/api",
});

export default axiosBase;
