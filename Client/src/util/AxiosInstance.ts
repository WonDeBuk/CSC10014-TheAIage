import Axios from 'axios';

const AxiosInstance = Axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
    withCredentials: true
})

AxiosInstance.interceptors.request.use(function (Config) {
    return Config;
  }, function (Error) {
    return Promise.reject(Error);
  });

AxiosInstance.interceptors.response.use(function (Response) {
    return Response;
  }, function (Error) {
    return Promise.reject(Error);
  });

export default AxiosInstance;