import { Axios, AxiosResponse } from "axios";
export const axios = new Axios({
  baseURL: import.meta.env.VITE_apiUrl || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: [
    (data, headers) => {
      try {
        if (headers["Content-Type"] === "application/json") {
          const data_ = JSON.stringify(data);
          return data_;
        } else {
          return data;
        }
      } catch (err) {
        console.log("couldn't transform request");
        return data;
      }
    },
  ],
  transformResponse: [
    (data) => {
      try {
        const data_ = JSON.parse(data);
        return data_;
      } catch (err) {
        return data;
      }
    },
  ],
});

export interface StandardHttpSuccess<T> {
  success: true;
  message: string;
  data?: T;
  statusCode: number;
}

export interface StandardHttpError {
  success: boolean;
  message: string;
  statusCode: number;
}

axios.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `${localStorage.getItem("jwt") || ""}`;
    return config;
  },
  (err) => Promise.reject(err)
);

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    // Check if the response has the required fields
    const resp = response.data.data;

    if (Array.isArray(resp)) {
      resp.forEach((item) => {
        if (item.createdAt && item.updatedAt) {
          item.createdAt = new Date(item.createdAt);
          item.updatedAt = new Date(item.updatedAt);
        }
      });
    } else if (resp && resp.createdAt && resp.updatedAt) {
      resp.createdAt = new Date(resp.createdAt);
      resp.updatedAt = new Date(resp.updatedAt);
    }
    return response;
  },
  (error) => {
    // Handle errors here
    return Promise.reject(error);
  }
);
