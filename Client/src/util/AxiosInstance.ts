import Axios from 'axios';

const AxiosInstance = Axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
})

AxiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

AxiosInstance.interceptors.response.use(function (Response) {
    return Response;
  }, function (Error) {
    return Promise.reject(Error);
  });

export default AxiosInstance;