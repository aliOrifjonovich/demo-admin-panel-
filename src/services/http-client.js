import axios from "axios";
import { QueryClient } from "react-query";
import { showAlert } from "redux/alert/alert.thunk";
import { store } from "redux/store";

const token = localStorage.getItem("token");

export const requestUnion = axios.create({
 baseURL: process.env.REACT_APP_PUBLIC_BASE_URL_MERAKI,

 params: {},
 headers: {
  Authorization: `Bearer ${token}`,
 },
});

export const requestUnionAuth = axios.create({
 baseURL: process.env.REACT_APP_PUBLIC_BASE_URL_MERAKI,
 params: {},
 headers: {},
});

const errorHandler = (error) => {
 store.dispatch(showAlert(error?.response?.data?.message, "error"));
 return Promise.reject(error.response);
};

requestUnion.interceptors.response.use(
 (response) => response.data.result,
 errorHandler
);
requestUnionAuth.interceptors.response.use(
 (response) => response.data.result,
 errorHandler
);

export const queryClient = new QueryClient({
 defaultOptions: {
  queries: {
   refetchOnWindowFocus: false,
   retry: false,
  },
 },
});
