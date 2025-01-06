"server-only";
import axios from "axios";
import { getAuthSession } from "@/app/_actions/config-actions";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || process.env.SERVER_URL,
});

// apiClient.interceptors.request.use((request) => {
//   // console.log("Axios Request Config:", request); // Logs all Axios request configurations

//   // Log approximate request payload size
//   // const dataString = JSON.stringify(request.data);
//   // console.log("Request Payload Size:", new Blob([dataString]).size, "bytes");

//   return request;
// });

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
