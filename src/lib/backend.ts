import { BACKEND_URL } from "@/env";
import axios from "axios";
import { getSession } from "next-auth/react";

// Define a function to get the access token
const getAccessToken = async () => {
  const session:any = await getSession();
  return session?.accessToken;
};

const instance = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// You can't use 'await' directly inside the object definition, so set the access token header in an interceptor.
instance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer${accessToken}`;
  }
  return config;
});

export default instance;
// export async function post(route: string, body = {}) {
//   try {
//     const response = await instance.post(route, body);
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// }