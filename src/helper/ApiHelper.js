import axios from "axios";

const MILLICAST_API = "https://director.millicast.com/api";
// const TOKEN =
//   "fb287fe7ccd14cc439eecf9d5aa7d6c4d71b79aeb3d8354d66c92caeaae9744e";
const TOKEN =
  "9a50a482ba1d738a620dcdc089c0a18a1dfa605fdedd8daa41e06199c5a53a85";

function create(url, options) {
  const instance = axios.create(Object.assign({ baseURL: url }, options));
  return instance;
}

function createWithAuth(url, Authorization, options) {
  const instance = axios.create(Object.assign({ baseURL: url }, options));
  setInterceptors(instance, Authorization);
  return instance;
}

export function setInterceptors(instance, Authorization) {
  // Add a request interceptor
  instance.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      config.headers.Authorization = `Bearer ${Authorization}`;
      return config;
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error);
    }
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );
}

export const base = create(MILLICAST_API);
export const auth = createWithAuth(MILLICAST_API, TOKEN);
