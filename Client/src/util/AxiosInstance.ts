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

AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/register";
    }

    return Promise.reject(error);
  }
);

export default AxiosInstance;