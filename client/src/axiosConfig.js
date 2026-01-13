import axios from 'axios'
const axiosBase = axios.create({
    baseURL: "http://localhost:5000/api"
})
export default axiosBase;