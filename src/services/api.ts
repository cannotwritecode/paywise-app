import axios from "axios";
import { getAuthToken, setAuthToken, getRefreshToken } from "./storage";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 15000,
});

let isRefreshing = false;
let subscribers: ((token: string | null) => void)[] = [];

const onTokenRefreshed = (token: string | null) =>
  subscribers.forEach((cb) => cb(token));
const addSubscriber = (cb: (token: string | null) => void) =>
  subscribers.push(cb);

API.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve) =>
          addSubscriber((token) => {
            if (token && original.headers) {
              original.headers.Authorization = `Bearer ${token}`;
              resolve(API(original));
            }
          })
        );
      }
      isRefreshing = true;
      try {
        const refreshToken = await getRefreshToken();
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refreshToken }
        );
        await setAuthToken(data.token, data.refreshToken);
        onTokenRefreshed(data.token);
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${data.token}`;
        return API(original);
      } catch (err) {
        isRefreshing = false;
        onTokenRefreshed(null);
        throw err;
      }
    }
    throw error;
  }
);

export default API;
