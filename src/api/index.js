/* eslint-disable */
import axios from "axios";
import cookieUtil from "../helpers/cookie-util";
const prefix = process.env.VUE_APP_API_BASE_URL;
import store from "../store/store";

export const SOCKET_URL = process.env.VUE_APP_SOCKET_URL;

const client = axios.create({
  baseURL: prefix,
  timeout: 20000,
  withCredentials: false
});

client.interceptors.request.use(config => {
  Object.assign(config.headers, getDefaultHeaders());
  return config;
});

function getDefaultHeaders() {
  return {
    Authorization: "Bearer " + cookieUtil.getCookie("token")
  };
}

let api = {
  onUnauthorized(cb) {
    client.interceptors.response.use(undefined, function(error) {
      const errorResponse = error.response;
      if (401 === errorResponse.status && cb) {
        cb(errorResponse);
      } else {
        const errorData = errorResponse.data;
        throw new Error(errorData.message);
      }
    });
  },
  get: async function(url) {
    store.dispatch("setLoading", true);
    const data = await client.get(prefix + url, {});
    store.dispatch("setLoading", false);
    return data;
  },
  post: function(url, data) {
    return client.post(prefix + url, data);
  },
  put: function(url, data) {
    return client.put(prefix + url, data);
  },
  delete: function(url, data) {
    return client.delete(prefix + url, data);
  },
  postForm: function(url, formData) {
    return client.post(prefix + url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  putForm: function(url, formData) {
    return client.put(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};

export default api;
