import Axios from 'axios';

const AxiosInstance = Axios.create({
    baseURL: "https://theaiage.up.railway.app",
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