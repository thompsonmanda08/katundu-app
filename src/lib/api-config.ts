"server-only";
import axios from "axios";
import { getAuthSession } from "@/app/_actions/config-actions";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const authenticatedService = async (request: any) => {
  const { session } = await getAuthSession();
  return await apiClient({
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
};

export default apiClient;
