import axios from "axios";
import applyInterceptor from "./interceptor.js";

const cancelToken = () => axios.CancelToken.source();
const isCancel = (thrown) => axios.isCancel(thrown);

const axiosInstance = axios.create({
  baseURL: (process.env.VUE_APP_API_V1 || ''),
})
axiosInstance.defaults.headers.common['Content-Type'] = 'application/json';
axiosInstance.defaults.headers.common['Accept'] = 'application/json';
// Session
let token = localStorage.getItem('token');
if (token){
  axiosInstance.defaults.headers.common['Authorization'] = "Bearer " + token;
}
applyInterceptor(axiosInstance);
// Interceptor
export default axiosInstance;
export {
  cancelToken,
  isCancel
}
