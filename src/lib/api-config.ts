"server-only";
import axios from "axios";
import {
  getAuthSession,
  revokeAccessToken,
} from "@/app/_actions/config-actions";
import { redirect } from "next/navigation";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const AUTH_URL = "/auth";

apiClient.interceptors.response.use(
  async (response) => {
    console.log("INTERCEPTOR....");

    if (response.status == 401) {
      await revokeAccessToken();
      redirect(AUTH_URL);
    }
    return response;
  },
  (error) => {
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error.message);
  }
);

export const authenticatedService = async (request: any) => {
  const { session } = await getAuthSession();
  const response = await apiClient({
    method: "GET",
    headers: {
      "Content-type": request?.contentType
        ? request.contentType
        : "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
      ...request?.headers,
    },
    withCredentials: true,
    ...request,
  });

  if (response.status == 401) {
    await revokeAccessToken();
    redirect(AUTH_URL);
  }

  return response;
};

export default apiClient;
